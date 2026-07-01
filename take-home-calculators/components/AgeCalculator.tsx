"use client";

import { useState, useMemo } from "react";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
  nextBirthday: { days: number; date: string };
  dayOfWeek: string;
  zodiac: string;
  lifePercent: number;
}

const ZODIAC = [
  { sign: "Capricorn ♑", start: [12, 22], end: [1, 19] },
  { sign: "Aquarius ♒", start: [1, 20], end: [2, 18] },
  { sign: "Pisces ♓", start: [2, 19], end: [3, 20] },
  { sign: "Aries ♈", start: [3, 21], end: [4, 19] },
  { sign: "Taurus ♉", start: [4, 20], end: [5, 20] },
  { sign: "Gemini ♊", start: [5, 21], end: [6, 20] },
  { sign: "Cancer ♋", start: [6, 21], end: [7, 22] },
  { sign: "Leo ♌", start: [7, 23], end: [8, 22] },
  { sign: "Virgo ♍", start: [8, 23], end: [9, 22] },
  { sign: "Libra ♎", start: [9, 23], end: [10, 22] },
  { sign: "Scorpio ♏", start: [10, 23], end: [11, 21] },
  { sign: "Sagittarius ♐", start: [11, 22], end: [12, 21] },
];

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getZodiac(month: number, day: number): string {
  for (const z of ZODIAC) {
    const [sm, sd] = z.start;
    const [em, ed] = z.end;
    if (sm === 12) {
      if ((month === 12 && day >= sd) || (month === 1 && day <= ed)) return z.sign;
    } else {
      if ((month === sm && day >= sd) || (month === em && day <= ed)) return z.sign;
    }
  }
  return "Capricorn ♑";
}

function calculateAge(dob: Date, asOf: Date): AgeResult {
  let years = asOf.getFullYear() - dob.getFullYear();
  let months = asOf.getMonth() - dob.getMonth();
  let days = asOf.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = Math.floor((asOf.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  const totalHours = totalDays * 24;

  // Next birthday
  let nextBirthday = new Date(asOf.getFullYear(), dob.getMonth(), dob.getDate());
  if (nextBirthday <= asOf) nextBirthday = new Date(asOf.getFullYear() + 1, dob.getMonth(), dob.getDate());
  const daysToNextBirthday = Math.ceil((nextBirthday.getTime() - asOf.getTime()) / (1000 * 60 * 60 * 24));

  const nextBdayStr = nextBirthday.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const dayOfWeek = DAYS[dob.getDay()];
  const zodiac = getZodiac(dob.getMonth() + 1, dob.getDate());

  // Life percent based on avg Indian life expectancy (72 years)
  const lifePercent = Math.min(100, Math.round((years / 72) * 100));

  return { years, months, days, totalDays, totalWeeks, totalMonths, totalHours,
    nextBirthday: { days: daysToNextBirthday, date: nextBdayStr }, dayOfWeek, zodiac, lifePercent };
}

export default function AgeCalculator() {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const [dob, setDob] = useState("1990-01-01");
  const [asOf, setAsOf] = useState(todayStr);

  const result = useMemo<AgeResult | null>(() => {
    if (!dob || !asOf) return null;
    const dobDate = new Date(dob);
    const asOfDate = new Date(asOf);
    if (isNaN(dobDate.getTime()) || isNaN(asOfDate.getTime())) return null;
    if (dobDate > asOfDate) return null;
    return calculateAge(dobDate, asOfDate);
  }, [dob, asOf]);

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="rounded-xl border border-rule bg-surface p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Date of Birth</label>
            <input type="date" value={dob} max={todayStr}
              onChange={e => setDob(e.target.value)}
              className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Age As Of</label>
            <input type="date" value={asOf} max={todayStr}
              onChange={e => setAsOf(e.target.value)}
              className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none" />
            <button onClick={() => setAsOf(todayStr)}
              className="mt-1 text-xs text-brand hover:underline">Reset to today</button>
          </div>
        </div>
      </div>

      {result ? (
        <>
          {/* Main age display */}
          <div className="rounded-2xl border border-brand/20 bg-brand-soft p-6 text-center">
            <p className="text-sm font-medium text-brand mb-2">Your Age</p>
            <div className="flex items-baseline justify-center gap-3 flex-wrap">
              <div className="text-center">
                <p className="font-display text-5xl font-bold text-brand">{result.years}</p>
                <p className="text-xs text-ink-soft mt-1">Years</p>
              </div>
              <span className="font-display text-3xl text-brand/40">·</span>
              <div className="text-center">
                <p className="font-display text-5xl font-bold text-brand">{result.months}</p>
                <p className="text-xs text-ink-soft mt-1">Months</p>
              </div>
              <span className="font-display text-3xl text-brand/40">·</span>
              <div className="text-center">
                <p className="font-display text-5xl font-bold text-brand">{result.days}</p>
                <p className="text-xs text-ink-soft mt-1">Days</p>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Total Days", value: result.totalDays.toLocaleString("en-IN"), icon: "📅" },
              { label: "Total Weeks", value: result.totalWeeks.toLocaleString("en-IN"), icon: "🗓️" },
              { label: "Total Months", value: result.totalMonths.toLocaleString("en-IN"), icon: "📆" },
              { label: "Total Hours", value: result.totalHours.toLocaleString("en-IN"), icon: "⏰" },
            ].map(stat => (
              <div key={stat.label} className="rounded-xl border border-rule bg-surface p-3 text-center shadow-card">
                <p className="text-xl">{stat.icon}</p>
                <p className="tabular mt-1 font-display text-lg font-bold text-ink">{stat.value}</p>
                <p className="text-xs text-ink-soft">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Next birthday */}
          <div className="rounded-xl border border-rule bg-surface p-5">
            <h3 className="font-semibold text-ink mb-3">More About You</h3>
            <div className="space-y-2.5">
              {[
                { label: "Born on", value: result.dayOfWeek },
                { label: "Zodiac sign", value: result.zodiac },
                { label: "Next birthday", value: result.nextBirthday.date },
                { label: "Days until next birthday", value: `${result.nextBirthday.days} days` },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-sm border-b border-rule last:border-0 pb-2 last:pb-0">
                  <span className="text-ink-soft">{row.label}</span>
                  <span className="font-medium text-ink">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Life percentage */}
          <div className="rounded-xl border border-rule bg-surface p-5">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-ink">Life lived</p>
              <p className="tabular text-sm font-semibold text-brand">{result.lifePercent}%</p>
            </div>
            <div className="h-3 w-full rounded-full bg-paper overflow-hidden border border-rule">
              <div className="h-3 rounded-full bg-brand transition-all duration-700"
                style={{ width: `${result.lifePercent}%` }} />
            </div>
            <p className="text-xs text-ink-soft mt-2">
              Based on India&apos;s average life expectancy of 72 years
            </p>
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-rule bg-surface p-8 text-center text-ink-soft">
          Enter your date of birth to calculate your age
        </div>
      )}
    </div>
  );
}
