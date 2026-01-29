"use client";

import { useActionState } from "react";
import { fetchPDF } from "../actions/fetchPDF";

export default function TranscriptForm() {
    const [state, formAction, isPending] = useActionState(fetchPDF, null);

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
                    42 Berlin
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

                {state?.success && (
                    <p className="mt-4 text-center text-sm text-[#00babc] animate-pulse">
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


            </footer>
        </div >
    );
}