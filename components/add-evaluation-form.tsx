"use client";

import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createEvaluationForm } from "@/actions/evaluation";
import { useRouter } from "next/navigation";

interface Question {
  text: string;
}

interface Category {
  title: string;
  criteria: number;
  questions: Question[];
}

interface EvaluationForm {
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  categories: Category[];
}

const AddEvaluationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [form, setForm] = useState<EvaluationForm>({
    title: "",
    description: "",
    startDateTime: "",
    endDateTime: "",
    categories: [],
  });

  // Add a new category
  const handleAddCategory = () => {
    const newCategory: Category = {
      title: "",
      criteria: 0,
      questions: [{ text: "" }], // Start with 1 question
    };
    setForm({ ...form, categories: [...form.categories, newCategory] });
  };

  // Add a question to a category
  const handleAddQuestion = (categoryIndex: number) => {
    const updatedCategories = [...form.categories];
    updatedCategories[categoryIndex].questions.push({ text: "" });
    setForm({ ...form, categories: updatedCategories });
  };

  // Handle input changes for the form fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    categoryIndex?: number,
    questionIndex?: number
  ) => {
    const { name, value } = e.target;

    // If we are changing a question
    if (categoryIndex !== undefined && questionIndex !== undefined) {
      const updatedCategories = [...form.categories];
      updatedCategories[categoryIndex].questions[questionIndex].text = value;
      setForm({ ...form, categories: updatedCategories });
    }
    // If we are changing a category or criteria
    else if (categoryIndex !== undefined) {
      const updatedCategories = [...form.categories];
      if (name === "title") updatedCategories[categoryIndex].title = value;
      if (name === "criteria")
        updatedCategories[categoryIndex].criteria = parseInt(value);
      setForm({ ...form, categories: updatedCategories });
    }
    // If we are changing the overall form (title, description, etc.)
    else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Save form data to the database
      const response = await createEvaluationForm(form);
      if (response.success) {
        toast.success(response.message);
        router.push("/coordinator/evaluation-form");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="px-2 pt-6 pb-1">
          <div className="mb-4 space-y-1">
            <Label>Title</Label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Enter Title"
              disabled={isLoading}
              className="border border-input!important"
            />
          </div>
          <div className="mb-4 space-y-1">
            <Label>Description</Label>
            <Textarea
              name="description"
              required
              value={form.description}
              onChange={handleChange}
              placeholder="Enter Description"
              className="border border-input!important"
              disabled={isLoading}
            />
          </div>
          <div className="mb-4 space-y-1">
            <Label>Start Date</Label>
            <Input
              type="datetime-local"
              required
              name="startDateTime"
              value={form.startDateTime}
              onChange={handleChange}
              className="border border-input!important"
              disabled={isLoading}
            />
          </div>
          <div className="mb-4 space-y-1">
            <Label>End Date</Label>
            <Input
              type="datetime-local"
              required
              name="endDateTime"
              value={form.endDateTime}
              onChange={handleChange}
              className="border border-input!important"
              disabled={isLoading}
            />
          </div>
          {form.categories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="mb-6 border rounded-2xl p-4 mt-2"
            >
              <h3 className="text-xl mb-2">Category {categoryIndex + 1}</h3>
              <div className="mb-4 space-y-1">
                <Label>Title</Label>
                <Input
                  name="title"
                  value={category.title}
                  onChange={(e) => handleChange(e, categoryIndex)}
                  required
                  placeholder="Enter Category Title"
                  className="border border-input!important"
                  disabled={isLoading}
                />
              </div>
              <div className="mb-4 space-y-1">
                <Label>Criteria (%)</Label>
                <Input
                  name="criteria"
                  type="number"
                  value={category.criteria}
                  onChange={(e) => handleChange(e, categoryIndex)}
                  required
                  placeholder="Enter Category Criteria"
                  className="border border-input!important"
                  disabled={isLoading}
                />
              </div>
              {category.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="mb-4 space-y-1">
                  <Label>Question {questionIndex + 1}</Label>
                  <Input
                    name="question"
                    value={question.text}
                    onChange={(e) =>
                      handleChange(e, categoryIndex, questionIndex)
                    }
                    required
                    placeholder="Enter Question"
                    className="border border-input!important"
                    disabled={isLoading}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="default"
                onClick={() => handleAddQuestion(categoryIndex)}
                disabled={isLoading}
                className="mb-4 w-full"
              >
                Add Question
              </Button>
            </div>
          ))}
          <div className="flex items-center gap-5">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddCategory}
              className="mb-4 w-full"
              disabled={isLoading}
            >
              Add Category
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isLoading}
              className="mb-4 w-full"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddEvaluationForm;
