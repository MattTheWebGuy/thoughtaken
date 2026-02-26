"use client";

import { FormEvent, useState } from "react";
import { SITE_CONFIG } from "../lib/site-config";

type SubmitState = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const section = SITE_CONFIG.sections.contact;
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [formStartedAt] = useState(() => Date.now());

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      company: String(formData.get("company") || "").trim(),
      formStartedAt,
    };

    setState("sending");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string; ok?: boolean };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to send message right now.");
      }

      setState("success");
      setMessage(section.successMessage);
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error ? error.message : section.fallbackErrorMessage,
      );
    }
  }

  return (
    <section
      id="contact"
      className="bg-black px-4 py-10 sm:px-6"
    >
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-950 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] sm:p-6 md:p-8">
        <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
          {section.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-300 md:text-base">
          {section.description}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              name="name"
              required
              placeholder={section.placeholders.name}
              className="w-full rounded-lg border border-neutral-700 bg-black px-4 py-3 text-sm text-white outline-none transition-colors duration-300 placeholder:text-gray-500 focus:border-white"
            />
            <input
              type="email"
              name="email"
              required
              placeholder={section.placeholders.email}
              className="w-full rounded-lg border border-neutral-700 bg-black px-4 py-3 text-sm text-white outline-none transition-colors duration-300 placeholder:text-gray-500 focus:border-white"
            />
          </div>
          <textarea
            name="message"
            required
            rows={5}
            placeholder={section.placeholders.message}
            className="w-full rounded-lg border border-neutral-700 bg-black px-4 py-3 text-sm text-white outline-none transition-colors duration-300 placeholder:text-gray-500 focus:border-white"
          />

          <button
            type="submit"
            disabled={state === "sending"}
            className="cursor-pointer rounded-full bg-white px-7 py-2.5 text-sm font-semibold uppercase tracking-[0.16em] text-black transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {state === "sending" ? section.buttonSendingLabel : section.buttonLabel}
          </button>

          {message ? (
            <p
              className={`text-sm ${
                state === "success" ? "text-gray-300" : "text-red-400"
              }`}
            >
              {message}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
