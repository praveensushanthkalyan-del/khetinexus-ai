const fs = require('fs');
let content = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

const emptyState = `
  if (currentFarm.id === 'new-farm') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center mb-6">
            <Sprout className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-stone-900 dark:text-white mb-3">
            Welcome to KhetiNexus AI
          </h2>
          <p className="text-stone-600 dark:text-stone-400 max-w-lg mx-auto mb-8 leading-relaxed">
            Please add your farm to activate the agricultural intelligence pipeline, satellite observations, and weather forecasting.
          </p>
          <button
            onClick={() => setActiveTab('farm-profile')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Farm</span>
          </button>
        </div>
      </div>
    );
  }
`;

content = content.replace(/  const getGreeting = \(\) => \{/, emptyState + '\n  const getGreeting = () => {');

fs.writeFileSync('src/components/DashboardView.tsx', content);
