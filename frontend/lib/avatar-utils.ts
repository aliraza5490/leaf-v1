export function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts.slice(0, 2).map((n) => n[0]).join("");
}

export function getAvatarGradient(name: string): string {
  if (!name) return "bg-gradient-to-br from-gray-500 to-slate-600 text-white border-gray-400/20";
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradients = [
    "bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-blue-400/20",
    "bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-400/20",
    "bg-gradient-to-br from-violet-500 to-purple-600 text-white border-violet-400/20",
    "bg-gradient-to-br from-pink-500 to-rose-600 text-white border-pink-400/20",
    "bg-gradient-to-br from-amber-500 to-orange-600 text-white border-amber-400/20",
    "bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-cyan-400/20",
    "bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white border-fuchsia-400/20",
    "bg-gradient-to-br from-teal-500 to-emerald-600 text-white border-teal-400/20",
  ];
  return gradients[hash % gradients.length];
}
