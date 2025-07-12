import { supabaseClient } from '@/lib/server/supabase'
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation'
import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Edit, Trash2, Plus } from 'lucide-react'

interface Template {
    body: string;
    created_at: string;
    id: number;
    name: string;
    teacher: string;
    variables: string[];
}

export default async function Oldtempletes() {
    const user = await currentUser();
    if (!user) {
        redirect('/sign-in');
    }
    
    const supabase = supabaseClient();
    const { data } = await supabase.from("templetes").select("*").eq("teacher", user.id);
    
    const templates: Template[] | null = data;

    const handleDelete = async (id: number) => {
        'use server'
        const supabase = supabaseClient();
        await supabase.from('templetes').delete().eq('id', id);
        redirect('/template'); // Redirect to refresh the page
    }

    if (!templates || templates.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Your Templates</h1>
                </div>
                
                <div className="text-center py-12">
                    <div className="mx-auto max-w-md">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
                        <p className="text-gray-600 mb-6">Get started by creating your first template</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Your Templates</h1>
                <Button asChild>
                    <Link href="/create-template">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Template
                    </Link>
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <Card key={template.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-lg">{template.name}</CardTitle>
                            <CardDescription>
                                Created: {new Date(template.created_at).toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        
                        <CardContent>
                            <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                                {template.body}
                            </p>
                            
                            {template.variables && template.variables.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Variables:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {template.variables.map((variable, index) => (
                                            <Badge key={index} variant="secondary">
                                                {variable}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        
                        <CardFooter className="flex gap-2">
                            <Button asChild variant="outline" size="sm" className="flex-1">
                                <Link href={`template/${template.id}`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </Button>
                            
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" className="flex-1">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the template "{template.name}".
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <form action={handleDelete.bind(null, template.id)}>
                                            <AlertDialogAction type="submit" className="bg-red-500 hover:bg-red-600">
                                                Delete
                                            </AlertDialogAction>
                                        </form>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}