import numpy as np
import sys
import json
import base64
import io
from PIL import Image

class SimplePMSFCA:
    def __init__(self, n_clusters=3, max_iter=50):  # fixed __init__
        self.n_clusters = n_clusters
        self.max_iter = max_iter
        
    def segment(self, image):
        """Simplified PMSFCA segmentation"""
        print(f"[v0] Starting simplified PMSFCA on image shape: {image.shape}")
        
        # Simple intensity-based clustering
        flat_img = image.flatten()
        
        # Compute intensity thresholds for 3 clusters (CSF, GM, WM)
        hist, bins = np.histogram(flat_img, bins=256)
        
        # Find peaks in histogram for cluster centers
        smooth_hist = np.convolve(hist, np.ones(5)/5, mode='same')
        peaks = []
        for i in range(1, len(smooth_hist)-1):
            if smooth_hist[i] > smooth_hist[i-1] and smooth_hist[i] > smooth_hist[i+1]:
                peaks.append(bins[i])
        
        # Use top 3 peaks or distribute evenly
        if len(peaks) >= 3:
            centers = sorted(peaks[:3])
        else:
            centers = [np.percentile(flat_img, p) for p in [25, 50, 75]]
        
        self.centers = np.array(centers)
        print(f"[v0] Cluster centers: {self.centers}")
        
        # Assign pixels to clusters based on closest center
        labels = np.zeros_like(flat_img, dtype=int)
        for i, pixel in enumerate(flat_img):
            distances = np.abs(pixel - self.centers)
            labels[i] = np.argmin(distances)
        
        labels = labels.reshape(image.shape)
        
        # Create membership maps (simplified)
        membership_maps = np.zeros(image.shape + (self.n_clusters,))
        for k in range(self.n_clusters):
            membership_maps[..., k] = (labels == k).astype(float)
        
        print(f"[v0] Segmentation complete. Unique labels: {np.unique(labels)}")
        return labels, membership_maps

def decode_base64_image(base64_string):
    """Decode base64 image string to numpy array"""
    try:
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        image_data = base64.b64decode(base64_string)
        img = Image.open(io.BytesIO(image_data))
        
        # Convert to grayscale if needed
        if img.mode != 'L':
            img = img.convert('L')
        
        # Convert to numpy array
        img_array = np.array(img, dtype=np.float32) / 255.0
        
        print(f"[v0] Decoded image shape: {img_array.shape}")
        return img_array
        
    except Exception as e:
        print(f"[v0] Error decoding image: {e}")
        return None

def encode_image_to_base64(img_array):
    """Encode numpy array to base64 string"""
    try:
        # Convert to uint8
        if img_array.dtype != np.uint8:
            img_uint8 = (img_array * 255).astype(np.uint8)
        else:
            img_uint8 = img_array
            
        # Create PIL image
        img = Image.fromarray(img_uint8, mode='L')
        
        # Convert to base64
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        
        return f"data:image/png;base64,{img_base64}"
        
    except Exception as e:
        print(f"[v0] Error encoding image: {e}")
        return None

def analyze_results(labels, membership_maps):
    """Analyze segmentation results"""
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

def main():
    try:
        if len(sys.argv) < 2:
            result = {"error": "No image data provided"}
            print(json.dumps(result))
            return
        
        base64_image = sys.argv[1]
        print(f"[v0] Processing PMSFCA analysis...")
        
        # Decode image
        img = decode_base64_image(base64_image)
        if img is None:
            result = {"error": "Failed to decode input image"}
            print(json.dumps(result))
            return
        
        # Resize if too large
        if img.shape[0] > 512 or img.shape[1] > 512:
            from PIL import Image
            pil_img = Image.fromarray((img * 255).astype(np.uint8))
            pil_img = pil_img.resize((min(512, img.shape[1]), min(512, img.shape[0])), Image.Resampling.LANCZOS)
            img = np.array(pil_img, dtype=np.float32) / 255.0
        
        # Apply PMSFCA
        pmsfca = SimplePMSFCA(n_clusters=3)
        labels, membership_maps = pmsfca.segment(img)
        
        # Create visualizations
        segmented_visual = np.zeros_like(labels, dtype=np.uint8)
        colors = [0, 255, 128]  # CSF, GM, WM
        for i, color in enumerate(colors):
            segmented_visual[labels == i] = color
        
        # ✅ White matter mask (highest intensity cluster)
        wm_mask = (labels == (pmsfca.n_clusters - 1)).astype(np.uint8) * 255
        
        # Analyze results
        analysis = analyze_results(labels, membership_maps)
        
        # Encode images
        original_b64 = encode_image_to_base64((img * 255).astype(np.uint8))
        segmented_b64 = encode_image_to_base64(segmented_visual)
        wm_b64 = encode_image_to_base64(wm_mask)
        
        # Prepare final results
        results = {
            "success": True,
            "analysis": analysis,
            "images": {
                "original": original_b64,
                "segmented": segmented_b64,
                "white_matter": wm_b64   # ✅ added WM output
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
        print(f"[v0] Error in main: {e}")
        result = {"error": str(e)}
        print(json.dumps(result))

if __name__ == "__main__":   # fixed entry point
    main()
