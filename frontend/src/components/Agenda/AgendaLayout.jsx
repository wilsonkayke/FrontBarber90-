export default function AgendaLayout({ children }) {
  const [currentAction, setCurrentAction] = useState(null);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100">

      <main className="flex-1">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              currentAction,
              setCurrentAction,
            });
          }

          return child;
        })}
      </main>

    </div>
  );
}