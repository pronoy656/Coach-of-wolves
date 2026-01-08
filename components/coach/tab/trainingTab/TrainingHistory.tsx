import { Clock, Dumbbell, TrendingUp } from "lucide-react";
import React from "react";

const TrainingHistory = () => {
    return (
        <div>
            {/* Training History Section */}
            <div className="space-y-4">
                <h2 className="text-3xl font-bold">Training History</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* History Card 1 */}
                    <div className="bg-gradient-to-br from-[#141424] to-[#0f0f1e] border border-emerald-500/30 shadow-lg rounded-lg">
                        <div className="p-6 space-y-4">
                            <div className="pb-4 border-b border-[#2a2a2a]">
                                <h3 className="text-xl font-bold mb-2">November</h3>
                                <p className="text-gray-400">9 Workouts</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Pull Fullbody</h4>
                                <p className="text-sm text-gray-400 mb-3">
                                    Tuesday, 18 November 2025 at 16:52
                                </p>
                                <div className="space-y-3">
                                    <div className="text-sm">
                                        <p className="text-gray-400">
                                            Sets / Bestes Set → Best Set
                                        </p>
                                        <p className="text-white mt-1">
                                            2 × Seated Row (Machine) → Best: 68 kg × 8 @ 10 [F]
                                        </p>
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-white">
                                            2 × Wide Row Machine → Best: 65 kg × 7 @ 10 [F]
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#2a2a2a] text-sm">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span>1 h 31 m</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Dumbbell className="w-4 h-4 text-gray-400" />
                                        <span>5000(kg)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                                        <span className="text-emerald-500">0 PRs</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* History Card 2 */}
                    <div className="bg-gradient-to-br from-[#141424] to-[#0f0f1e] border border-[#2d2d45] shadow-lg rounded-lg">
                        <div className="p-6 space-y-4">
                            <div className="pb-4 border-b border-[#2a2a2a]">
                                <h3 className="text-xl font-bold mb-2">
                                    Tuesday, 18 November 2025 at 16:52
                                </h3>
                                <p className="text-gray-400">
                                    Warm up the rotator cuffs and hips
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold">Seated Row (Machine)</h4>
                                        <span className="text-sm text-gray-400">1 Rm</span>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">36 kg x 6</span>
                                            <span>42</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">50 kg x 6</span>
                                            <span>51</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold">Wide Row (Machine)</h4>
                                        <span className="text-sm text-gray-400">1 Rm</span>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">20 kg x 6</span>
                                            <span>23</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">40 kg x 2</span>
                                            <span>41</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainingHistory;