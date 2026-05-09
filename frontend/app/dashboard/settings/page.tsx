"use client";

import { useEffect, useState } from "react";
import {
  Bell, Shield, Wifi, Database, User, Save, Eye, EyeOff,
} from "lucide-react";
import DarkModeToggle from "../../components/DarkModeToggle";
import { api } from "../../../lib/api";
import { auth } from "../../../lib/auth";

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all";

const selectClass =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all";

function Section({ icon, title, desc, children }: {
  icon: React.ReactNode; title: string; desc: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700">{icon}</div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
        </div>
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-8">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
        {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
      </div>
      <div className="shrink-0 w-64">{children}</div>
    </div>
  );
}

function Toggle({ enabled, onChange, label }: { enabled: boolean; onChange: () => void; label: string }) {
  return (
    <label className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={enabled}
        onChange={onChange}
        aria-label={label}
      />
      <span className={`h-6 w-11 rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2 dark:peer-focus:ring-offset-slate-800 ${enabled ? "bg-blue-500" : "bg-slate-200 dark:bg-slate-600"}`} />
      <span className={`absolute h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 ${enabled ? "translate-x-6" : "translate-x-1"}`} />
    </label>
  );
}

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const user = auth.get();
    if (user) {
      api.users.get(user.id)
        .then((data) => {
          setProfile({ id: data.id, name: data.name, email: data.email, phone: data.phone || "", password: "" });
          setIsLoading(false);
        })
        .catch((err: unknown) => {
          console.error("Failed to fetch profile:", err);
          setIsLoading(false);
        });
    }
  }, []);

  const [thresholds, setThresholds] = useState({
    warning: "400", critical: "500", minReduction: "45", offlineMinutes: "5",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true, criticalOnly: false, weeklyReport: true, deviceOffline: true,
  });

  const [dataSettings, setDataSettings] = useState({
    interval: "3", retention: "90", timezone: "Africa/Kigali",
  });

  const [apiSettings, setApiSettings] = useState({
    endpoint: "https://api.cleanair.rw/v1", key: "sk-live-••••••••••••••••",
  });

  const p = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setProfile((f) => ({ ...f, [field]: e.target.value }));
  const t = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setThresholds((f) => ({ ...f, [field]: e.target.value }));
  const d = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setDataSettings((f) => ({ ...f, [field]: e.target.value }));

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const body: { name: string; email: string; phone: string; password?: string } = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
      };

      if (profile.password) {
        body.password = profile.password;
      }

      const data = await api.users.update(profile.id, body);
      auth.set(data);
      setMessage({ text: "Profile updated successfully!", type: "success" });
      setProfile((prev) => ({ ...prev, password: "" }));
    } catch (err: unknown) {
      setMessage({ text: err instanceof Error ? err.message : "Failed to update profile", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure system behaviour, alerts, and account preferences
          </p>
        </div>
        <DarkModeToggle />
      </div>

      {/* Message */}
      {message.text && (
        <div className={`px-4 py-3 rounded-xl text-sm border ${
          message.type === "success" 
            ? "bg-green-500/10 border-green-500/50 text-green-500" 
            : "bg-red-500/10 border-red-500/50 text-red-500"
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile */}
      <Section icon={<User className="w-4 h-4 text-blue-500" />} title="Admin Profile" desc="Your account details">
        <Field label="Full Name">
          <input title="Full Name" placeholder="Your full name" className={inputClass} value={profile.name} onChange={p("name")} />
        </Field>
        <Field label="Email Address">
          <input type="email" title="Email Address" placeholder="Email address" className={inputClass} value={profile.email} onChange={p("email")} />
        </Field>
        <Field label="Phone Number" hint="Used for SMS alerts (optional)">
          <input title="Phone Number" placeholder="+250 788 000 000" className={inputClass} value={profile.phone} onChange={p("phone")} />
        </Field>
        <Field label="Password" hint="Leave empty to keep current password">
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              className={inputClass} 
              value={profile.password || ""} 
              onChange={p("password")} 
              placeholder="••••••••" 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </Field>
        <div className="flex justify-end pt-1">
          <button 
            type="button" 
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save Profile</>}
          </button>
        </div>
      </Section>

      {/* Alert Thresholds */}
      <Section icon={<Bell className="w-4 h-4 text-yellow-500" />} title="Alert Thresholds" desc="CO ppm levels that trigger warnings and critical alerts on vehicles and industries">
        <Field label="Warning Level" hint="CO input above this triggers a warning alert">
          <div className="flex items-center gap-2">
            <input type="number" title="Warning Level (ppm)" className={inputClass} value={thresholds.warning} onChange={t("warning")} />
            <span className="text-sm text-slate-400 shrink-0">ppm</span>
          </div>
        </Field>
        <Field label="Critical Level" hint="CO input above this triggers a critical alert">
          <div className="flex items-center gap-2">
            <input type="number" title="Critical Level (ppm)" className={inputClass} value={thresholds.critical} onChange={t("critical")} />
            <span className="text-sm text-slate-400 shrink-0">ppm</span>
          </div>
        </Field>
        <Field label="Min. Purification Rate" hint="Alert if reduction falls below this">
          <div className="flex items-center gap-2">
            <input type="number" title="Min. Purification Rate (%)" className={inputClass} value={thresholds.minReduction} onChange={t("minReduction")} />
            <span className="text-sm text-slate-400 shrink-0">%</span>
          </div>
        </Field>
        <Field label="Device Offline After" hint="Alert if no data received within">
          <div className="flex items-center gap-2">
            <input type="number" title="Device Offline After (minutes)" className={inputClass} value={thresholds.offlineMinutes} onChange={t("offlineMinutes")} />
            <span className="text-sm text-slate-400 shrink-0">min</span>
          </div>
        </Field>
        <div className="flex justify-end pt-1">
          <button type="button" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
            <Save className="w-4 h-4" /> Save Thresholds
          </button>
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={<Shield className="w-4 h-4 text-green-500" />} title="Notifications" desc="Choose how and when you receive alerts">
        {(Object.keys(notifications) as (keyof typeof notifications)[]).map((key) => {
          const labels: Record<keyof typeof notifications, { label: string; hint: string }> = {
            emailAlerts:    { label: "Email Alerts",          hint: "Receive alert emails for threshold breaches" },
            criticalOnly:   { label: "Critical Alerts Only",  hint: "Skip warnings, only send critical notifications" },
            weeklyReport:   { label: "Weekly Summary Report", hint: "Email digest of all readings every Monday" },
            deviceOffline:  { label: "Device Offline Alerts", hint: "Notify when a vehicle/industry device goes offline" },
          };
          return (
            <Field key={key} label={labels[key].label} hint={labels[key].hint}>
              <div className="flex justify-end">
                <Toggle
                  enabled={notifications[key]}
                  onChange={() => setNotifications((n) => ({ ...n, [key]: !n[key] }))}
                  label={labels[key].label}
                />
              </div>
            </Field>
          );
        })}
      </Section>

      {/* Data & Connectivity */}
      <Section icon={<Wifi className="w-4 h-4 text-cyan-500" />} title="Data & Connectivity" desc="Sensor polling and data retention settings">
        <Field label="Polling Interval" hint="How often ESP32 sends a reading">
          <select title="Polling interval" className={selectClass} value={dataSettings.interval} onChange={d("interval")}>
            <option value="1">Every 1 second</option>
            <option value="2">Every 2 seconds</option>
            <option value="3">Every 3 seconds</option>
            <option value="5">Every 5 seconds</option>
            <option value="10">Every 10 seconds</option>
          </select>
        </Field>
        <Field label="Data Retention" hint="How long readings are kept in the database">
          <select title="Data retention period" className={selectClass} value={dataSettings.retention} onChange={d("retention")}>
            <option value="30">30 days</option>
            <option value="60">60 days</option>
            <option value="90">90 days</option>
            <option value="180">6 months</option>
            <option value="365">1 year</option>
          </select>
        </Field>
        <Field label="Timezone">
          <select title="Timezone" className={selectClass} value={dataSettings.timezone} onChange={d("timezone")}>
            <option value="Africa/Kigali">Africa/Kigali (UTC+2)</option>
            <option value="UTC">UTC</option>
          </select>
        </Field>
        <div className="flex justify-end pt-1">
          <button type="button" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </Section>

      {/* API */}
      <Section icon={<Database className="w-4 h-4 text-purple-500" />} title="API & Integration" desc="Backend endpoint and authentication key for ESP32 devices">
        <Field label="API Endpoint">
          <input title="API Endpoint" className={inputClass} value={apiSettings.endpoint} onChange={(e) => setApiSettings((a) => ({ ...a, endpoint: e.target.value }))} />
        </Field>
        <Field label="API Key" hint="Used by ESP32 devices to authenticate">
          <div className="flex items-center gap-2">
            <input title="API Key" className={inputClass} value={apiSettings.key} readOnly />
            <button type="button" className="shrink-0 px-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
              Rotate
            </button>
          </div>
        </Field>
        <div className="flex justify-end pt-1">
          <button type="button" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
            <Save className="w-4 h-4" /> Save API Settings
          </button>
        </div>
      </Section>
    </div>
  );
}
