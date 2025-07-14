export default function BreachCountCard({ count }: { count: number }) {
  const breached = count > 0;
  return (
    <div
      className={`rounded-2xl p-8 border mt-10
        ${breached ? 'bg-gradient-to-r from-red-900 to-red-700 border-red-600' : 'bg-gradient-to-r from-green-900 to-green-700 border-green-600'}`}
    >
      <div className="text-center">
        {breached ? (
          <>
            <div className="text-6xl font-extrabold text-red-300">{count}</div>
            <div className="text-2xl font-bold mb-4 text-red-200">
              Data Breach{count === 1 ? '' : 'es'}
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl font-extrabold text-green-300">{count}</div>
            <div className="text-2xl font-bold mb-4 text-green-200">Good News</div>
          </>
        )}
        <p className={breached ? 'text-red-100' : 'text-green-100'}>
          {breached
            ? 'Oh no — pwned! This email address has been found in multiple data breaches. Review the details below to see where your data was exposed.'
            : "Good news — no pwnage found! This email address wasn't found in any of the data breaches loaded into Have I Been Pwned. That's great news!"}
        </p>
      </div>
    </div>
  );
}
