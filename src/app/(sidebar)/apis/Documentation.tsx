import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Mail, Users } from "lucide-react"

export default function Documentation() {
  return (
    <TabsContent value="documentation" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email API
                </CardTitle>
                <CardDescription>Send emails and manage templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Send Email</h4>
                  <Textarea
                    readOnly
                    value={`POST /api/v1/email/send
Authorization: Bearer YOUR_API_KEY

{
  "to": "student@example.com",
  "subject": "Welcome to the course!",
  "template": "welcome",
  "variables": {
    "name": "John Doe",
    "course": "Web Development"
  }
}`}
                    className="text-sm font-mono"
                  />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">List Templates</h4>
                  <Textarea
                    readOnly
                    value={`GET /api/v1/email/templates
Authorization: Bearer YOUR_API_KEY`}
                    className="text-sm font-mono"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Students API
                </CardTitle>
                <CardDescription>Manage your student database</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Add Student</h4>
                  <Textarea
                    readOnly
                    value={`POST /api/v1/students
Authorization: Bearer YOUR_API_KEY

{
  "email": "student@example.com",
  "name": "John Doe",
  "course": "web-development",
  "status": "enrolled"
}`}
                    className="text-sm font-mono"
                  />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Update Student</h4>
                  <Textarea
                    readOnly
                    value={`PUT /api/v1/students/:id
Authorization: Bearer YOUR_API_KEY

{
  "status": "completed",
  "progress": 100
}`}
                    className="text-sm font-mono"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Important Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>• Keep your API keys secure and never share them publicly</p>
              <p>• Use different keys for different environments (development, staging, production)</p>
              <p>• Regenerate keys immediately if you suspect they have been compromised</p>
              <p>• API requests are rate limited to 1000 requests per hour per key</p>
              <p>• All API endpoints use HTTPS and require authentication</p>
            </CardContent>
          </Card>
        </TabsContent>
  )
}
