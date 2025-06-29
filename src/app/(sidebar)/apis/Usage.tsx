import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Usage() {
	return (
		<TabsContent value="usage" className="space-y-6">
			<div className="grid gap-6 md:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>Email Usage</CardTitle>
						<CardDescription>This month</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">2,847</div>
						<p className="text-xs text-muted-foreground">
							emails sent
						</p>
						<div className="mt-2">
							<div className="text-sm text-muted-foreground">
								Limit: 10,000/month
							</div>
							<div className="w-full bg-secondary rounded-full h-2 mt-1">
								<div
									className="bg-primary h-2 rounded-full"
									style={{ width: "28%" }}
								></div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>API Requests</CardTitle>
						<CardDescription>Last 24 hours</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">1,234</div>
						<p className="text-xs text-muted-foreground">
							requests made
						</p>
						<div className="mt-2">
							<div className="text-sm text-muted-foreground">
								Rate limit: 1,000/hour
							</div>
							<div className="w-full bg-secondary rounded-full h-2 mt-1">
								<div
									className="bg-primary h-2 rounded-full"
									style={{ width: "52%" }}
								></div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Students</CardTitle>
						<CardDescription>Total managed</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">15,678</div>
						<p className="text-xs text-muted-foreground">
							active students
						</p>
						<div className="mt-2">
							<div className="text-sm text-green-600">
								+234 this week
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Recent API Activity</CardTitle>
					<CardDescription>Last 10 API calls</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Endpoint</TableHead>
								<TableHead>Method</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Timestamp</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow>
								<TableCell>/api/v1/email/send</TableCell>
								<TableCell>POST</TableCell>
								<TableCell>
									<Badge variant="default">200</Badge>
								</TableCell>
								<TableCell>2 minutes ago</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>/api/v1/students</TableCell>
								<TableCell>POST</TableCell>
								<TableCell>
									<Badge variant="default">201</Badge>
								</TableCell>
								<TableCell>5 minutes ago</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>/api/v1/students/123</TableCell>
								<TableCell>PUT</TableCell>
								<TableCell>
									<Badge variant="default">200</Badge>
								</TableCell>
								<TableCell>8 minutes ago</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</TabsContent>
	);
}
