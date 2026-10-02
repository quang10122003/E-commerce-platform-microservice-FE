import { Flame, Star, Zap } from "lucide-react";
import type { SuggestionTab } from "@/utils/suggestions.utils";

const tabs = [
  { id: "all", label: "Gợi Ý Cho Bạn", icon: Flame, color: "text-cta" },
  { id: "sale", label: "Sale Giảm Sốc", icon: Zap, color: "text-cta" },
  { id: "bestseller", label: "Top Bán Chạy", icon: Star, color: "text-amber-500" },
] as const;

export function SuggestionTabs({ activeTab, onSelect }: { activeTab: SuggestionTab; onSelect: (tab: SuggestionTab) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-3d sticky top-[61px] z-20 overflow-hidden">
      <div className="flex items-center overflow-x-auto scrollbar-none divide-x divide-slate-100">
        {tabs.map(({ id, label, icon: Icon, color }) => (
          <button key={id} onClick={() => onSelect(id)} className={`flex-1 min-w-[130px] sm:min-w-[160px] py-3.5 px-3 flex flex-col items-center justify-center gap-1 text-center transition-all duration-200 relative cursor-pointer ${activeTab === id ? "bg-primary-light/60 text-primary font-bold shadow-inner" : "text-slate-700 hover:bg-slate-50 font-medium"}`}>
            <div className="flex items-center gap-2 text-xs sm:text-sm"><Icon className={`w-4 h-4 ${activeTab === id ? "text-primary fill-primary/20" : color}`} /><span className="whitespace-nowrap">{label}</span></div>
            {activeTab === id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-indigo-600 rounded-t-full animate-fadeIn" />}
          </button>
        ))}
      </div>
    </div>
  );
}
