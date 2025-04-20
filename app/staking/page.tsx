export default function StakingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Staking Pools</h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Join our staking pools to earn passive income on your crypto assets with fixed 15% APY returns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-800/40 via-indigo-700/40 to-blue-600/40 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">ETH Staking Pool (20)</h3>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">ETH</span>
            </div>
            <p className="text-white/70 mb-4">
              Join our ETH staking pool with up to 20 participants. Earn 15% APY with daily trading opportunities.
            </p>

            <div className="mb-4">
              <div className="flex justify-between text-white/70 text-sm mb-1">
                <span>Participants</span>
                <span>12/20</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "60%" }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-white/70 text-sm mb-1">Min Stake</div>
                <div className="text-white font-medium">0.5 ETH</div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-white/70 text-sm mb-1">Max Stake</div>
                <div className="text-white font-medium">5 ETH</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col items-center">
                <div className="text-white/70 text-sm mb-1">APY</div>
                <div className="text-green-400 font-medium">15%</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-white/70 text-sm mb-1">Lock Period</div>
                <div className="text-white font-medium">30 days</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-white/70 text-sm mb-1">Total Staked</div>
                <div className="text-white font-medium">35.75 ETH</div>
              </div>
            </div>

            <a
              href="/staking/pool1"
              className="block w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white text-center py-2 rounded"
            >
              View Details
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-800/40 via-indigo-700/40 to-blue-600/40 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">BTC Staking Pool (10)</h3>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">BTC</span>
            </div>
            <p className="text-white/70 mb-4">
              Join our BTC staking pool with up to 10 participants. Earn 15% APY with daily trading opportunities.
            </p>

            <div className="mb-4">
              <div className="flex justify-between text-white/70 text-sm mb-1">
                <span>Participants</span>
                <span>7/10</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "70%" }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-white/70 text-sm mb-1">Min Stake</div>
                <div className="text-white font-medium">0.01 BTC</div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-white/70 text-sm mb-1">Max Stake</div>
                <div className="text-white font-medium">0.5 BTC</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col items-center">
                <div className="text-white/70 text-sm mb-1">APY</div>
                <div className="text-green-400 font-medium">15%</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-white/70 text-sm mb-1">Lock Period</div>
                <div className="text-white font-medium">30 days</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-white/70 text-sm mb-1">Total Staked</div>
                <div className="text-white font-medium">2.35 BTC</div>
              </div>
            </div>

            <a
              href="/staking/pool2"
              className="block w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white text-center py-2 rounded"
            >
              View Details
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-800/40 via-indigo-700/40 to-blue-600/40 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">SOL Staking Pool (50)</h3>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">SOL</span>
            </div>
            <p className="text-white/70 mb-4">
              Join our SOL staking pool with up to 50 participants. Earn 15% APY with daily trading opportunities.
            </p>

            <div className="mb-4">
              <div className="flex justify-between text-white/70 text-sm mb-1">
                <span>Participants</span>
                <span>32/50</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "64%" }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-white/70 text-sm mb-1">Min Stake</div>
                <div className="text-white font-medium">5 SOL</div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-white/70 text-sm mb-1">Max Stake</div>
                <div className="text-white font-medium">100 SOL</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col items-center">
                <div className="text-white/70 text-sm mb-1">APY</div>
                <div className="text-green-400 font-medium">15%</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-white/70 text-sm mb-1">Lock Period</div>
                <div className="text-white font-medium">30 days</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-white/70 text-sm mb-1">Total Staked</div>
                <div className="text-white font-medium">1,250 SOL</div>
              </div>
            </div>

            <a
              href="/staking/pool3"
              className="block w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white text-center py-2 rounded"
            >
              View Details
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
