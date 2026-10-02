import { Search, Sparkles } from "lucide-react";
import { Button, Input } from "@/components/ui";

const HOT_KEYWORDS = ["iPhone 16", "Tai nghe ANC", "Bàn phím cơ", "Sạc 65W GaN", "Áo Polo"];

type HeaderSearchProps = { searchQuery: string; setSearchQuery: (value: string) => void; handleSearch: (keyword?: string) => void; };

export function HeaderSearch({ searchQuery, setSearchQuery, handleSearch }: HeaderSearchProps) {
  return (
    <>
            {/* 2.2 SEARCH BAR WITH HOT KEYWORDS */}
            <div className="flex-1 max-w-xl mx-1 sm:mx-4">
              <form
                className="relative flex items-center"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSearch();
                }}
              >
                <Input
                  placeholder="Tìm kiếm sản phẩm, thương hiệu chính hãng..."
                  leftIcon={<Search className="w-4 h-4 text-primary" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 text-xs sm:text-sm bg-slate-50/90 rounded-xl pr-18 sm:pr-20 focus-visible:bg-white border-slate-200 focus-visible:ring-primary/25"
                />
                <Button
                  variant="gradient-cta"
                  size="sm"
                  type="submit"
                  aria-label="Tìm kiếm sản phẩm"
                  title="Tìm kiếm sản phẩm"
                  className="absolute right-1.5 h-7.5 w-8 p-0 rounded-lg"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </form>

              {/* Hot search chips (desktop only) */}
              <div className="hidden lg:flex items-center gap-2 mt-1.5 px-1">
                <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-cta" /> Gợi ý:
                </span>
                {HOT_KEYWORDS.map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => {
                      setSearchQuery(kw);
                      handleSearch(kw);
                    }}
                    className="text-[10px] text-slate-600 hover:text-primary transition-colors hover:underline cursor-pointer"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>

    </>
  );
}
