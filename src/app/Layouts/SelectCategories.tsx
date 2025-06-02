"use client";

import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  categoryid: string;
  categoryname: string;
  productcount: number;
  createdAt: string;
}

interface SelectCategoriesProps {
  onChange: (value: string) => void;
}

const SelectCategories: React.FC<SelectCategoriesProps> = ({ onChange }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const getAllCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category?type=all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <Select name='categoryid' onValueChange={onChange}>
      <SelectTrigger className="">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {categories.map(category => (
            <SelectItem key={category.categoryid} value={category.categoryid}>
              {category.categoryname}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectCategories;
