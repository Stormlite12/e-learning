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
    const [formData, setFormData] = useState(
        {
            name: '',
            courseDescription: '',
            includeVideo: false,
            courseChapters: 1,
            category: '',
            level: ''

        }
    );
    const router=useRouter();

    const onHandleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        console.log(formData);
    }

    const onGenerate = async () => {

        console.log(formData)
        const courseId=uuidv4()
        try {
            setLoading(true);
            const result = await axios.post('/api/generate-course-layout', {
                ...formData,
                courseId:courseId
            });
      
            if(result.data.resp=='limit exceed'){
                toast.warning('Please Subscribe to Plan!')
                router.push('/workspace/billing')
            }
            setLoading(false)
            router.push('/workspace/edit-course/'+result.data?.courseId);
        }
        catch (e) {
            setLoading(false)
            console.log(e)
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new course using AI</DialogTitle>
                    <DialogDescription asChild>
                        <div className="flex flex-col gap-3 mt-3">
                            <div>
                                <label>Course Name</label>
                                <Input placeholder='course name'
                                    onChange={(event) => onHandleInputChange('name', event?.target.value)} />
                            </div>
                            <div>
                                <label>Course Description (Optional)</label>
                                <Textarea placeholder='course description'
                                    onChange={(event) => onHandleInputChange('courseDescription', event?.target.value)} />
                            </div>
                            <div>
                                <label>Number of Chapters</label>
                                <Input placeholder='course chapters' type='number'
                                    onChange={(event) => onHandleInputChange('courseChapters', event?.target.value)} />
                            </div>
                            <div className="flex gap-3 items-center">
                                <label>Include Video</label>
                                <Switch
                                    onCheckedChange={() => onHandleInputChange('includeVideo', !formData?.includeVideo)} />
                            </div>
                            <div>
                                <label>Difficulty Level</label>
                                <Select onValueChange={(value) => onHandleInputChange('level', value)}>
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
                                <Input placeholder='category (separated by comma)'
                                    onChange={(event) => onHandleInputChange('category', event?.target.value)} />
                            </div>
                            <div className="mt-5">
                                <Button className={'w-full'} onClick={onGenerate} disabled={loading} >{loading ? <Loader2Icon className="animate-spin" /> : <Sparkle />}Generate Course</Button>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default AddNewCourseDialog;