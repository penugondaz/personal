"use client";
import { useState } from "react";

type Mode = "ofNumber"|"increase"|"decrease"|"difference"|"isWhat";

const MODES: {id:Mode;label:string;desc:string;la:string;lb:string}[] = [
  {id:"ofNumber", label:"% of Number",      desc:"What is X% of Y?",            la:"Percentage (%)", lb:"Number"},
  {id:"increase", label:"% Increase",       desc:"Increase Y by X%",            la:"Increase by (%)", lb:"Starting value"},
  {id:"decrease", label:"% Decrease",       desc:"Decrease Y by X%",            la:"Decrease by (%)", lb:"Starting value"},
  {id:"difference",label:"% Change",        desc:"% change from A to B",        la:"From",           lb:"To"},
  {id:"isWhat",   label:"X is what % of Y", desc:"A is what % of B?",           la:"Value A",        lb:"Value B"},
];

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>("ofNumber");
  const [a, setA] = useState("25");
  const [b, setB] = useState("200");
  const [result, setResult] = useState<string|null>(null);

  const calc = () => {
    const na = parseFloat(a)||0, nb = parseFloat(b)||0;
    switch(mode) {
      case "ofNumber":   setResult(`${na}% of ${nb} = ${(na*nb/100).toFixed(4).replace(/\.?0+$/, "")}`); break;
      case "increase":   setResult(`${nb} increased by ${na}% = ${(nb*(1+na/100)).toFixed(2)}`); break;
      case "decrease":   setResult(`${nb} decreased by ${na}% = ${(nb*(1-na/100)).toFixed(2)}`); break;
      case "difference": {
        const diff = ((nb-na)/na*100);
        setResult(`${na} → ${nb} is ${diff>=0?"+":""}${diff.toFixed(2)}% change`);
        break;
      }
      case "isWhat": setResult(`${na} is ${(na/nb*100).toFixed(4).replace(/\.?0+$/, "")}% of ${nb}`); break;
    }
  };

  const current = MODES.find(m => m.id === mode)!;

  return (
    <>
      <div className="mt-8 rounded-2xl border border-rule bg-surface p-5 shadow-card">
        <div className="flex flex-wrap gap-2 mb-5">
          {MODES.map(m => (
            <button key={m.id} onClick={()=>{setMode(m.id);setResult(null);}}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${mode===m.id?"bg-brand text-white":"border border-rule text-ink-soft hover:border-brand hover:text-brand"}`}>
              {m.label}
            </button>
          ))}
        </div>
        <p className="mb-4 text-sm text-ink-soft">{current.desc}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">{current.la}</span>
            <input type="text" inputMode="decimal" value={a} onChange={e=>{setA(e.target.value);setResult(null);}} className="tabular w-full rounded-lg border border-rule bg-paper px-3 py-3 text-xl font-semibold text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-soft">{current.lb}</span>
            <input type="text" inputMode="decimal" value={b} onChange={e=>{setB(e.target.value);setResult(null);}} className="tabular w-full rounded-lg border border-rule bg-paper px-3 py-3 text-xl font-semibold text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
          </label>
        </div>
        <button onClick={calc} className="mt-4 w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white hover:bg-brand-dark transition">Calculate</button>
      </div>

      {result && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-rule bg-surface shadow-card-lg">
          <div className="brand-gradient px-6 py-8 text-center">
            <p className="font-display text-2xl font-semibold text-white sm:text-3xl">{result}</p>
          </div>
        </div>
      )}
    </>
  );
}
