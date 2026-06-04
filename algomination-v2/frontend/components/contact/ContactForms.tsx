"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import {
  submitContact,
  submitFeedback,
  submitProject,
} from "@/lib/api/community";
import { cn } from "@/lib/utils";

type TabKey = "feedback" | "project" | "contact";

const TABS: { key: TabKey; label: string }[] = [
  { key: "feedback", label: "Feedback" },
  { key: "project", label: "Submit a Project" },
  { key: "contact", label: "Contact Us" },
];

// --- Schemas ----------------------------------------------------------------
const feedbackSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Enter a valid email"),
  message: z.string().min(5, "Tell us a little more (min 5 chars)"),
});
const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  algorithm: z.string().min(1, "Which algorithm is it?"),
  githubUrl: z.url("Enter a valid GitHub URL"),
  email: z.email("Enter a valid email"),
});
const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Enter a valid email"),
  message: z.string().min(5, "Your message is a bit short"),
});

export function ContactForms() {
  const [tab, setTab] = useState<TabKey>("feedback");

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-xl bg-surface-2 p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              tab === t.key
                ? "bg-brand text-white"
                : "text-muted hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card>
        {tab === "feedback" && <FeedbackForm />}
        {tab === "project" && <ProjectForm />}
        {tab === "contact" && <ContactForm />}
      </Card>
    </div>
  );
}

// --- Individual forms -------------------------------------------------------
function FeedbackForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    await submitFeedback(data);
    toast.success("Thanks for the feedback!");
    reset();
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input label="Name" {...register("name")} error={errors.name?.message} />
      <Input
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <Textarea
        label="Your feedback"
        {...register("message")}
        error={errors.message?.message}
      />
      <Button type="submit" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "Sending…" : "Send feedback"}
      </Button>
    </form>
  );
}

function ProjectForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    await submitProject(data);
    toast.success("Project submitted — thank you!");
    reset();
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input label="Your name" {...register("name")} error={errors.name?.message} />
      <Input
        label="Algorithm"
        placeholder="e.g. Merge Sort"
        {...register("algorithm")}
        error={errors.algorithm?.message}
      />
      <Input
        label="GitHub URL"
        placeholder="https://github.com/…"
        {...register("githubUrl")}
        error={errors.githubUrl?.message}
      />
      <Input
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <Button type="submit" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "Submitting…" : "Submit project"}
      </Button>
    </form>
  );
}

function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    await submitContact(data);
    toast.success("Message sent — we'll be in touch!");
    reset();
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input label="Name" {...register("name")} error={errors.name?.message} />
      <Input
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <Textarea
        label="Message"
        {...register("message")}
        error={errors.message?.message}
      />
      <Button type="submit" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
