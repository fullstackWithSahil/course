"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Copy, Eye, EyeOff, Plus, RotateCcw, Trash2, Key } from "lucide-react"
import { toast } from "sonner"
import { ApiKey, permissionOptions } from "./constants"
import { deleteApiKey, generateApiKey,regenerateApiKeys } from "@/actions/generatekey"

export default function Keys() {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
	const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
	const [newKeyName, setNewKeyName] = useState("");
	const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>([]);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	const toggleKeyVisibility = (keyId: number) => {
		setShowKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }));
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast("Copied to clipboard");
	};

	const generateNewKey = async() => {
        try {
            
            const newKey =  await generateApiKey(newKeyName, newKeyPermissions);
            if (!newKey) {
                toast.error("Failed to generate API key. Please try again.");
                return;
            }
            setApiKeys((prev) => [...prev, newKey as ApiKey]);
            setNewKeyName("");
            setNewKeyPermissions([]);
            setIsCreateDialogOpen(false);
            toast("Your new API key has been generated successfully.");
        } catch (error) {
            console.log({error});
        }
	};

	const regenerateKey = async(keyId: number) => {
        const newKey = await regenerateApiKeys(keyId);
        if (!newKey) {
            toast.error("Failed to regenerate API key. Please try again.");
            return;
        }
		setApiKeys((prev) =>prev.map((key) =>key.id === keyId? {...key,key:newKey}: key));
		toast("Your API key has been regenerated. Update your applications with the new key.");
	};

	const deleteKey = async(keyId:number) =>{
        const keyTodelete = await deleteApiKey(keyId);
        if (!keyTodelete) {
            toast.error("Failed to delete API key. Please try again.");
            return;
        }
		setApiKeys((prev) => prev.filter((key) => key.id !== keyTodelete));
		toast("The API key has been permanently deleted.");
	};

	const maskKey = (key: string) => {
		return `${key.substring(0, 12)}${"•".repeat(20)}${key.substring(
			key.length - 4
		)}`;
	};
	return (
		<TabsContent value="keys" className="space-y-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<Key className="h-5 w-5" />
							Your API Keys
						</CardTitle>
						<CardDescription>
							Create and manage API keys for your course platform
							integrations
						</CardDescription>
					</div>
					<Dialog
						open={isCreateDialogOpen}
						onOpenChange={setIsCreateDialogOpen}
					>
						<DialogTrigger asChild>
							<Button>
								<Plus className="h-4 w-4 mr-2" />
								Create New Key
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Create New API Key</DialogTitle>
								<DialogDescription>
									Generate a new API key with specific
									permissions for your integrations.
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-4">
								<div>
									<Label htmlFor="keyName">Key Name</Label>
									<Input
										id="keyName"
										placeholder="e.g., Production Email API"
										value={newKeyName}
										onChange={(e) =>
											setNewKeyName(e.target.value)
										}
									/>
								</div>
								<div>
									<Label>Permissions</Label>
									<div className="grid grid-cols-1 gap-2 mt-2">
										{permissionOptions.map((permission) => (
											<div
												key={permission.value}
												className="flex items-center space-x-2"
											>
												<input
													type="checkbox"
													id={permission.value}
													checked={newKeyPermissions.includes(
														permission.value
													)}
													onChange={(e) => {
														if (e.target.checked) {
															setNewKeyPermissions(
																(prev) => [
																	...prev,
																	permission.value,
																]
															);
														} else {
															setNewKeyPermissions(
																(prev) =>
																	prev.filter(
																		(p) =>
																			p !==
																			permission.value
																	)
															);
														}
													}}
													className="rounded"
												/>
												<Label
													htmlFor={permission.value}
													className="flex items-center gap-2"
												>
													<permission.icon className="h-4 w-4" />
													{permission.label}
												</Label>
											</div>
										))}
									</div>
								</div>
							</div>
							<DialogFooter>
								<Button
									variant="outline"
									onClick={() => setIsCreateDialogOpen(false)}
								>
									Cancel
								</Button>
								<Button
									onClick={generateNewKey}
									disabled={
										!newKeyName ||
										newKeyPermissions.length === 0
									}
								>
									Create API Key
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>API Key</TableHead>
								<TableHead>Permissions</TableHead>
								<TableHead>Created</TableHead>
								<TableHead>Last Used</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{apiKeys.map((apiKey) => (
								<TableRow key={apiKey.id}>
									<TableCell className="font-medium">
										{apiKey.name}
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<code className="text-sm bg-muted px-2 py-1 rounded">
												{showKeys[apiKey.id]
													? apiKey.key
													: maskKey(apiKey.key)}
											</code>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													toggleKeyVisibility(
														apiKey.id
													)
												}
											>
												{showKeys[apiKey.id] ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													copyToClipboard(apiKey.key)
												}
											>
												<Copy className="h-4 w-4" />
											</Button>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex flex-wrap gap-1">
											{apiKey.permissions.map(
												(permission) => (
													<Badge
														key={permission}
														variant="secondary"
														className="text-xs"
													>
														{permission}
													</Badge>
												)
											)}
										</div>
									</TableCell>
									<TableCell>{apiKey.created_at}</TableCell>
									<TableCell>{apiKey.lastUsed}</TableCell>
									<TableCell>
										<Badge
											variant={
												apiKey.status === "active"
													? "default"
													: "secondary"
											}
										>
											{apiKey.status}
										</Badge>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-1">
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													regenerateKey(apiKey.id)
												}
											>
												<RotateCcw className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													deleteKey(apiKey.id)
												}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</TabsContent>
	);
}
