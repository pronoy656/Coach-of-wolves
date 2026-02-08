/* eslint-disable @next/next/no-img-element */
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AthleteCardProps {
  _id: string;
  name: string;
  status: "Natural" | "Enhanced";
  category: string;
  phase: string;
  createdAt: string;
  image: string;
  gender: string;
}
function formatToShortDate(dateString: string): string {
  const date = new Date(dateString);

  const day = date.getUTCDate(); // day of month
  const month = date.toLocaleString("en-US", {
    month: "short",
    timeZone: "UTC",
  }); // short month
  const year = date.getUTCFullYear(); // year

  return `${day} ${month} ${year}`;
}

export default function AthleteCard({
  _id,
  name,
  status,
  category,
  phase,
  createdAt,
  image,
  gender,
}: AthleteCardProps) {
  const statusColor = status === "Natural" ? "bg-green-600" : "bg-orange-500";

  const getGenderStyle = (gender: string) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "bg-blue-500/20 text-blue-400";
      case "female":
        return "bg-pink-500/20 text-pink-400";
      default:
        return "text-[#8CCA4D]";
    }
  };

  const genderStyle = getGenderStyle(gender);

  console.log(_id, name, status, category, phase, createdAt, image, gender);

  return (
    <Link href={`/coach/details/${_id}`} className="block">
      <div className="border border-[#4C8B1B]/60 bg-[#08081A] rounded-lg p-5 hover:border-[#4C8B1B] transition-all duration-200 group">
        <div className="flex items-center justify-between gap-6">
          {/* Left: Avatar + Info */}

          <div className="flex items-start gap-5 flex-1">
            <img
              src={`${process.env.NEXT_PUBLIC_LOCAL_BASE_URL}${image}`}
              alt={name}
              width={64}
              height={64}
              className="rounded-full object-cover border-2 border-[#4A9E4A]/30"
            />

            <div className="flex-1">
              <h3 className="font-bold text-xl text-white mb-3">{name}</h3>

              <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Gender</p>
                  <span
                    className={`${genderStyle} text-xs px-3 py-1 rounded-full font-semibold`}
                  >
                    {gender}
                  </span>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Category</p>
                  <p className="text-[#8CCA4D] font-semibold">{category}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Phase</p>
                  <p className="text-[#8CCA4D] font-semibold">{phase}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Status</p>
                  <span
                    className={`${statusColor} text-white text-xs px-4 py-1.5 rounded-full font-medium`}
                  >
                    {status}
                  </span>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    Created Date
                  </p>
                  <p className="text-[#8CCA4D] font-semibold">
                    {formatToShortDate(createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Right: Arrow (appears on hover) */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight size={28} className="text-[#8CCA4D]" />
          </div>
        </div>
      </div>
    </Link>
  );
}
