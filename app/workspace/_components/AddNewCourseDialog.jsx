import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Sparkle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function AddNewCourseDialog({ children }) {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        courseDescription: '',
        includeVideo: false,
        courseChapters: 1,
        category: '',
        level: ''
    });
    const router = useRouter();

    const onHandleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        console.log(formData);
    }

    const onGenerate = async () => {
        console.log(formData)
        const courseId = uuidv4()
        try {
            setLoading(true);
            const result = await axios.post('/api/generate-course-layout', {
                ...formData,
                courseId: courseId
            });

            if (result.data.resp == 'limit exceed') {
                toast.warning('Please Subscribe to Plan!')
                router.push('/workspace/billing')
            } else {
                toast.success('Course generated successfully!')
                setOpen(false); // Close dialog
                
                // Reset form
                setFormData({
                    name: '',
                    courseDescription: '',
                    includeVideo: false,
                    courseChapters: 1,
                    category: '',
                    level: ''
                });
                
                // Refresh the workspace page to show new course
                router.refresh();
                
                // Navigate to edit page
                router.push('/workspace/edit-course/' + result.data?.courseId);
            }
            setLoading(false)
        }
        catch (e) {
            setLoading(false)
            toast.error('Failed to generate course')
            console.log(e)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new course using AI</DialogTitle>
                    <DialogDescription asChild>
                        <div className="flex flex-col gap-3 mt-3">
                            <div>
                                <label>Course Name</label>
                                <Input 
                                    placeholder='course name'
                                    value={formData.name}
                                    onChange={(event) => onHandleInputChange('name', event?.target.value)} 
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label>Course Description (Optional)</label>
                                <Textarea 
                                    placeholder='course description'
                                    value={formData.courseDescription}
                                    onChange={(event) => onHandleInputChange('courseDescription', event?.target.value)} 
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label>Number of Chapters</label>
                                <Input 
                                    placeholder='course chapters' 
                                    type='number'
                                    value={formData.courseChapters}
                                    onChange={(event) => onHandleInputChange('courseChapters', event?.target.value)} 
                                    disabled={loading}
                                />
                            </div>
                            <div className="flex gap-3 items-center">
                                <label>Include Video</label>
                                <Switch
                                    checked={formData.includeVideo}
                                    onCheckedChange={() => onHandleInputChange('includeVideo', !formData?.includeVideo)} 
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label>Difficulty Level</label>
                                <Select 
                                    value={formData.level}
                                    onValueChange={(value) => onHandleInputChange('level', value)}
                                    disabled={loading}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="select difficulty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label>Category</label>
                                <Input 
                                    placeholder='category (separated by comma)'
                                    value={formData.category}
                                    onChange={(event) => onHandleInputChange('category', event?.target.value)} 
                                    disabled={loading}
                                />
                            </div>
                            <div className="mt-5">
                                <Button 
                                    className={'w-full'} 
                                    onClick={onGenerate} 
                                    disabled={loading || !formData.name || !formData.level || !formData.category}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2Icon className="animate-spin mr-2" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkle className="mr-2" />
                                            Generate Course
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default AddNewCourseDialog;