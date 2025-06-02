
"use client"
import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";

interface customUploader {
  onChange: any
}

const UploadImage: React.FC<customUploader> = ({onChange})  => {
  return (
    <Input  type="file" placeholder="upload image" id="name" className="col-span-1" onChange={onChange} />
  )
}

export default UploadImage