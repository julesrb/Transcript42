"use client";

import { useActionState, useEffect } from "react";
import { fetchPDF } from "../actions/fetchPDF";

export default function TranscriptForm() {
    const [state, formAction, isPending] = useActionState(fetchPDF, null);

    useEffect(() => {
        if (state?.success && state.pdfBase64) {
            // Create a blob from the base64 string
            const byteCharacters = atob(state.pdfBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "application/pdf" });

            // Create a link and trigger download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = state.fileName || "transcript_42.pdf";
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
    }, [state]);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    const currentYear = new Date().getFullYear();
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const MIN_YEAR = 1940;
    const MIN_AGE = 10;
    const maxYear = currentYear - MIN_AGE;

    const years = Array.from(
        { length: maxYear - MIN_YEAR + 1 },
        (_, i) => maxYear - i
    );

    return (
        <div className="transcript-card z-10">
            <header className="mb-10 text-center">
                <h1 className="text-white m-0 leading-tight text-4xl lg:text-5xl font-black tracking-tighter">
                    ft_Transcript
                </h1>
                <p className="text-white/40 mt-3 text-lg font-medium">
                    Academic Transcript
                </p>
            </header>

            <form action={formAction} className="space-y-2">
                <input type="hidden" name="user_id" value="user_id_placeholder" />

                {/* Date of Birth */}
                <label className="transcript-label">
                    Date of Birth
                    <div className="input-wrapper">
                        <div className="date-grid">
                            <select name="dob_day" required className="transcript-select">
                                <option value="">Day</option>
                                {days.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>

                            <select name="dob_month" required className="transcript-select">
                                <option value="">Month</option>
                                {months.map((m, i) => (
                                    <option key={m} value={i + 1}>{m}</option>
                                ))}
                            </select>

                            <select name="dob_year" required className="transcript-select">
                                <option value="">Year</option>
                                {years.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </label>

                {/* Location of Birth */}
                <label className="transcript-label">
                    Location of Birth
                    <div className="input-wrapper">
                        <input
                            name="location_of_birth"
                            required
                            className="transcript-input"
                            placeholder="e.g. Berlin, Germany"
                        />
                    </div>
                </label>

                <div className="grid grid-cols-2 gap-4">
                    {/* Language */}
                    <label className="transcript-label">
                        Language
                        <div className="input-wrapper">
                            <select name="language" required className="transcript-select">
                                <option value="en">English</option>
                                <option value="de">German</option>
                            </select>
                        </div>
                    </label>

                    {/* Transcript Type */}
                    <label className="transcript-label">
                        Transcript Type
                        <div className="input-wrapper">
                            <select
                                name="transcript_type"
                                required
                                className="transcript-select"
                            >
                                <option value="core">Core</option>
                                <option value="core_advanced">Core + Advanced</option>
                            </select>
                        </div>
                    </label>
                </div>

                <button type="submit" disabled={isPending} className="btn-generate">
                    {isPending ? (
                        <>
                            <div className="spinner" />
                            Generating...
                        </>
                    ) : (
                        "Generate Transcript"
                    )}
                </button>

                {state?.success === false && (
                    <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                        <p className="text-red-400 text-sm mb-3 font-medium">
                            {state.message}
                        </p>
                        <a
                            href={`https://github.com/julesrb/Transcript42/issues/new?title=[Error]%20${encodeURIComponent(state.message)}&body=I%20encountered%20the%20following%20error%20while%20generating%20my%20transcript:%0A%0A**Error%20Message:**%20${encodeURIComponent(state.message)}%0A%0A###%20Steps%20to%20reproduce:%0A1.%20Fill%20in%20the%20form%0A2.%20Click%20Generate%0A3.%20Error%20appears`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm font-semibold text-red-200 transition-colors no-underline"
                        >
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            Report this error
                        </a>
                    </div>
                )}

                {state?.success && (
                    <p className="mt-4 text-center text-sm text-[#00babc] animate-pulse font-medium">
                        {state.message}
                    </p>
                )}
            </form>

            <footer className="note-box">
                <p>
                    Only Berlin campus is fully supported so far. If you want to
                    include your campus to have their logo, legal notes, and
                    address featured on your PDF,{" "}
                    <a
                        href="mailto:jubernar@student.42berlin.de"
                        className="note-link"
                    >
                        let&apos;s talk.
                    </a>
                </p>
                <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="m-0 opacity-60">Something not looking right?</p>
                    <a
                        href="https://github.com/julesrb/Transcript42/issues/new?title=[Problem]%20Issue%20Report&body=###%20Describe%20the%20problem%0A%0A###%20Expected%20behavior%0A%0A###%20Browser/System%0A"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 group text-white/80 hover:text-[#00babc] transition-colors font-semibold no-underline"
                    >
                        <svg className="w-5 h-5 fill-current opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        Report Problem
                    </a>
                </div>
            </footer>
        </div >
    );
}