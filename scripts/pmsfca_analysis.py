import numpy as np
import sys
import json
import base64
import io
import cv2
from PIL import Image
from scipy.ndimage import convolve

# -------------------------
# PMSFCA CLASS
# -------------------------
class PMSFCA:
    def __init__(self, n_clusters=3, m=2, max_iter=100, tol=1e-5):
        self.n_clusters = n_clusters
        self.m = m
        self.max_iter = max_iter
        self.tol = tol

    def initialize_membership(self, n_samples):
        return np.random.dirichlet(np.ones(self.n_clusters), size=n_samples)

    def compute_cluster_centers(self, X, U):
        um = U ** self.m
        return (um.T @ X) / np.sum(um.T, axis=1, keepdims=True)

    def update_membership(self, X, centers):
        dist = np.linalg.norm(X[:, None] - centers[None, :], axis=2) + 1e-10
        exp = 2 / (self.m - 1)
        denom = (dist[:, :, None] / dist[:, None, :]) ** exp
        return 1 / np.sum(denom, axis=2)

    def fit(self, image):
        X = image.flatten().astype(np.float32)[:, None]
        n_samples = X.shape[0]
        U = self.initialize_membership(n_samples)
        for _ in range(self.max_iter):
            centers = self.compute_cluster_centers(X, U)
            U_new = self.update_membership(X, centers)
            if np.linalg.norm(U_new - U) < self.tol:
                break
            U = U_new
        self.centers = centers.flatten()
        self.U = U
        return U.reshape(image.shape + (self.n_clusters,))

    def pseudo_trapezoidal_membership(self, image):
        img = image.flatten()
        min_val, max_val = np.min(img), np.max(img)
        ptm = np.zeros((len(img), self.n_clusters))
        for i, c in enumerate(self.centers):
            a = (self.centers[i-1] + c)/2 if i > 0 else min_val
            d = (self.centers[i+1] + c)/2 if i < self.n_clusters-1 else max_val
            b = (a + c) / 2
            c_ = (c + d) / 2
            for j, val in enumerate(img):
                if val <= a or val >= d:
                    ptm[j, i] = 0
                elif a < val < b:
                    ptm[j, i] = (val - a) / (b - a)
                elif b <= val <= c_:
                    ptm[j, i] = 1
                elif c_ < val < d:
                    ptm[j, i] = (d - val) / (d - c_)
        return ptm.reshape(image.shape + (self.n_clusters,))

    def spatial_smoothing(self, membership_maps):
        kernel = np.array([[0, 1, 0],
                           [1, 1, 1],
                           [0, 1, 0]], dtype=np.float32) / 5.0
        smoothed = np.zeros_like(membership_maps)
        for k in range(self.n_clusters):
            smoothed[..., k] = convolve(membership_maps[..., k], kernel)
        return smoothed

# -------------------------
# HELPER FUNCTIONS
# -------------------------
def decode_base64_image(base64_string):
    try:
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        image_data = base64.b64decode(base64_string)
        img = Image.open(io.BytesIO(image_data))
        if img.mode != 'L':
            img = img.convert('L')
        img_array = np.array(img, dtype=np.float32) / 255.0
        return img_array
    except Exception as e:
        print(f"Error decoding image: {e}")
        return None

def encode_image_to_base64(img_array):
    try:
        if img_array.dtype != np.uint8:
            img_uint8 = (img_array * 255).astype(np.uint8)
        else:
            img_uint8 = img_array
        img = Image.fromarray(img_uint8, mode='L')
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        return f"data:image/png;base64,{img_base64}"
    except Exception as e:
        print(f"Error encoding image: {e}")
        return None

def analyze_results(labels, membership_maps):
    unique_labels = np.unique(labels)
    analysis = {
        'total_pixels': int(labels.size),
        'num_clusters': len(unique_labels),
        'cluster_stats': {}
    }
    for label in unique_labels:
        mask = labels == label
        pixel_count = np.sum(mask)
        percentage = (pixel_count / labels.size) * 100
        avg_membership = np.mean(membership_maps[..., label])
        analysis['cluster_stats'][int(label)] = {
            'pixel_count': int(pixel_count),
            'percentage': round(float(percentage), 2),
            'avg_membership': round(float(avg_membership), 4)
        }
    return analysis

# -------------------------
# MAIN FUNCTION
# -------------------------
def main():
    try:
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No image data provided"}))
            return
        
        base64_image = sys.argv[1]
        img = decode_base64_image(base64_image)
        if img is None:
            print(json.dumps({"error": "Failed to decode input image"}))
            return
        
        # Resize if large
        if img.shape[0] > 512 or img.shape[1] > 512:
            pil_img = Image.fromarray((img*255).astype(np.uint8))
            pil_img = pil_img.resize((min(512,img.shape[1]), min(512,img.shape[0])), Image.Resampling.LANCZOS)
            img = np.array(pil_img, dtype=np.float32)/255.0
        
        # Apply PMSFCA
        pmsfca = PMSFCA(n_clusters=3)
        U_fcm = pmsfca.fit(img)
        U_ptm = pmsfca.pseudo_trapezoidal_membership(img)
        U_smooth = pmsfca.spatial_smoothing(U_ptm)
        labels = np.argmax(U_smooth, axis=-1).astype(np.uint8)
        
        # Automatic cluster → WM, GM, CSF
        sorted_idx = np.argsort(pmsfca.centers)
        csf_label, gm_label, wm_label = sorted_idx[0], sorted_idx[1], sorted_idx[2]
        
        # Segmented visualization
        segmented_visual = np.zeros_like(labels, dtype=np.uint8)
        segmented_visual[labels == csf_label] = 0
        segmented_visual[labels == gm_label] = 128
        segmented_visual[labels == wm_label] = 255
        
        # White matter mask
        wm_mask = np.zeros_like(labels, dtype=np.uint8)
        wm_mask[labels == wm_label] = 255
        
        # Morphological refinement
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3,3))
        wm_clean = cv2.morphologyEx(wm_mask, cv2.MORPH_OPEN, kernel, iterations=2)
        wm_clean = cv2.morphologyEx(wm_clean, cv2.MORPH_CLOSE, kernel, iterations=2)
        wm_clean = cv2.GaussianBlur(wm_clean, (3,3), 0)
        
        # Overlay
        overlay = cv2.addWeighted(wm_mask, 0.5, wm_clean, 0.5, 0)
        
        # Analyze results
        analysis = analyze_results(labels, U_smooth)
        
        # Encode images
        original_b64 = encode_image_to_base64((img*255).astype(np.uint8))
        segmented_b64 = encode_image_to_base64(segmented_visual)
        wm_b64 = encode_image_to_base64(wm_mask)
        wm_clean_b64 = encode_image_to_base64(wm_clean)
        overlay_b64 = encode_image_to_base64(overlay)
        
        results = {
            "success": True,
            "analysis": analysis,
            "images": {
                "original": original_b64,
                "segmented": segmented_b64,
                "white_matter_raw": wm_b64,
                "white_matter_refined": wm_clean_b64,
                "overlay": overlay_b64
            },
            "cluster_centers": [float(c) for c in pmsfca.centers],
            "processing_info": {
                "algorithm": "PMSFCA",
                "clusters": pmsfca.n_clusters,
                "iterations": "Converged",
                "image_size": f"{img.shape[1]}x{img.shape[0]}"
            }
        }
        
        print(json.dumps(results))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
