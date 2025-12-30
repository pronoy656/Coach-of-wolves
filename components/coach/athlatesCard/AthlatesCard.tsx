// import { ChevronRight } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";

// interface AthleteCardProps {
//   id: string;
//   name: string;
//   status: string;
//   category: string;
//   phase: string;
//   daysAway: string;
//   image: string;
//   gender: string;
// }

// export default function AthlatesCard({
//   id,
//   name,
//   status,
//   category,
//   phase,
//   daysAway,
//   image,
// }: // gender,
// AthleteCardProps) {
//   // console.log("Athlete ID:", id);
//   const statusColor = status === "Natural" ? "bg-green-600" : "bg-orange-400";

//   return (
//     <Link href={`/coach/details/${id}`}>
//       <div className="border border-[#4C8B1B]/60 bg-[#08081A] rounded-lg p-4 hover:border-[#4C8B1B] transition group ">
//         <div className="flex items-center justify-between gap-4">
//           {/* Athlete Info */}
//           <div className="flex items-start gap-4 flex-1">
//             <Image
//               src={image || "/placeholder.svg"}
//               alt={name}
//               width={56}
//               height={60}
//               className="rounded-full object-cover"
//             />
//             <div className="flex-1">
//               <div className="flex items-center gap-2 mb-3">
//                 <h3 className="font-semibold text-lg">{name}</h3>
//               </div>
//               <div className="grid grid-cols-4 gap-6 text-sm">
//                 <div>
//                   <p className="text-muted-foreground text-xs mb-1">
//                     Category :
//                   </p>
//                   <p className="text-[#8CCA4D] font-semibold">{category}</p>
//                 </div>
//                 <div>
//                   <p className="text-muted-foreground text-xs mb-1">Phase :</p>
//                   <p className="text-[#8CCA4D] font-semibold">{phase}</p>
//                 </div>
//                 <div>
//                   <p className="text-muted-foreground text-xs mb-1">Status :</p>
//                   <span
//                     className={`${statusColor} text-xs px-4 py-1 rounded-full text-background font-medium inline-block`}
//                   >
//                     {status}
//                   </span>
//                 </div>
//                 <div>
//                   <p className="text-muted-foreground text-xs mb-1">
//                     Show Date :
//                   </p>
//                   <p className="text-[#8CCA4D] font-semibold">{daysAway}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Arrow */}
//           <button className="p-2 rounded-lg hover:bg-secondary/50 transition opacity-0 group-hover:opacity-100">
//             <ChevronRight size={24} className="text-muted-foreground" />
//           </button>
//         </div>
//       </div>
//     </Link>
//   );
// }

// components/AthleteCard.tsx

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
}: AthleteCardProps) {
  const statusColor = status === "Natural" ? "bg-green-600" : "bg-orange-500";

  console.log(_id, name, status, category, phase, createdAt, image);

  return (
    <Link href={`/coach/details/${_id}`} className="block">
      <div className="border border-[#4C8B1B]/60 bg-[#08081A] rounded-lg p-5 hover:border-[#4C8B1B] transition-all duration-200 group">
        <div className="flex items-center justify-between gap-6">
          {/* Left: Avatar + Info */}
          <div className="flex items-start gap-5 flex-1">
            <Image
              src={image || "/placeholder.svg"}
              alt={name}
              width={64}
              height={64}
              className="rounded-full object-cover border-2 border-[#4A9E4A]/30"
            />

            <div className="flex-1">
              <h3 className="font-bold text-xl text-white mb-3">{name}</h3>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
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
