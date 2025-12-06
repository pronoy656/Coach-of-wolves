import { ChevronRight } from "lucide-react";

interface AthleteCardProps {
  name: string;
  status: string;
  category: string;
  phase: string;
  daysAway: string;
  image: string;
  gender: string;
}

export default function AthlatesCard({
  name,
  status,
  category,
  phase,
  daysAway,
  image,
  gender,
}: AthleteCardProps) {
  const statusColor = status === "Natural" ? "bg-green-600" : "bg-orange-400";

  return (
    <div className="border border-[#4C8B1B]/60 bg-[#08081A] rounded-lg p-4 hover:border-[#4C8B1B] transition group ">
      <div className="flex items-center justify-between gap-4">
        {/* Athlete Info */}
        <div className="flex items-start gap-4 flex-1">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold text-lg">{name}</h3>
            </div>
            <div className="grid grid-cols-4 gap-6 text-sm">
              <div>
                <p className="text-muted-foreground text-xs mb-1">Category :</p>
                <p className="text-[#8CCA4D] font-semibold">{category}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Phase :</p>
                <p className="text-[#8CCA4D] font-semibold">{phase}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Status :</p>
                <span
                  className={`${statusColor} text-xs px-4 py-1 rounded-full text-background font-medium inline-block`}
                >
                  {status}
                </span>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">
                  Show Date :
                </p>
                <p className="text-[#8CCA4D] font-semibold">{daysAway}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <button className="p-2 rounded-lg hover:bg-secondary/50 transition opacity-0 group-hover:opacity-100">
          <ChevronRight size={24} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
