import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, User, Calendar, Phone, Mail, UserPlus, History } from "lucide-react"
import Link from "next/link"

export default async function PatientsPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let patients = null
  let userLogs = null

  if (user) {
    // Fetch user's patients and analysis logs
    const { data: patientsData } = await supabase
      .from("patients")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    const { data: logsData } = await supabase
      .from("analysis_results")
      .select("*, patients(first_name, last_name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)

    patients = patientsData
    userLogs = logsData
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
            <p className="text-gray-600 mt-2">
              {user
                ? "Manage your patient records and medical data"
                : "Register to save and access your medical analysis history"}
            </p>
          </div>
          <div className="flex gap-3">
            {!user ? (
              <Link href="/auth/sign-up">
                <Button className="bg-violet-600 hover:bg-violet-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register to Save Files
                </Button>
              </Link>
            ) : (
              <Link href="/patients/new">
                <Button className="bg-violet-600 hover:bg-violet-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Patient
                </Button>
              </Link>
            )}
          </div>
        </div>

        {!user ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="bg-violet-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <UserPlus className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Register to Save Your Medical Files</h3>
              <p className="text-gray-600 mb-6">
                Create an account to save your medical image analysis results and access them anytime
              </p>
              <Link href="/auth/sign-up">
                <Button className="bg-violet-600 hover:bg-violet-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {userLogs && userLogs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <History className="h-5 w-5 mr-2" />
                    Recent Analysis History
                  </CardTitle>
                  <CardDescription>Your latest medical image analysis results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">
                            {log.patients ? `${log.patients.first_name} ${log.patients.last_name}` : "Unknown Patient"}
                          </p>
                          <p className="text-xs text-gray-600">
                            {new Date(log.created_at).toLocaleDateString()} - Confidence: {log.confidence_score}%
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {log.image_type || "Medical Image"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Existing patients section */}
            {patients && patients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patients.map((patient) => (
                  <Card key={patient.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-violet-100 p-2 rounded-full">
                            <User className="h-5 w-5 text-violet-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {patient.first_name} {patient.last_name}
                            </CardTitle>
                            <CardDescription>MRN: {patient.medical_record_number || "Not assigned"}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {patient.gender || "N/A"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {patient.date_of_birth && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            Born: {new Date(patient.date_of_birth).toLocaleDateString()}
                          </div>
                        )}
                        {patient.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            {patient.phone}
                          </div>
                        )}
                        {patient.email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            {patient.email}
                          </div>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <Link href={`/patients/${patient.id}`}>
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No patients yet</h3>
                  <p className="text-gray-600 mb-6">Get started by adding your first patient</p>
                  <Link href="/patients/new">
                    <Button className="bg-violet-600 hover:bg-violet-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Patient
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
