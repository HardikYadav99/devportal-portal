function ApplicationsList({
    applications,
    handleDelete
}) {
    {applications.length === 0 && (
        <p>No Applications are deployed now</p>
    )};

    return (
        <div className="applications-list">
            <h2>Deployed Applications</h2>

            {applications.map((app) => (
                <div
                key={app.name}
                className="application-card"
                >
                    <div>
                        <h3>{app.name}</h3>

                        <a
                        href={app.url}
                        target="_blank"
                        rel="noreferrer"
                        >
                            {app.url}
                        </a>
                    </div>

                    <button
                    onClick={() => handleDelete(app.name)}
                    >
                        Delete
                    </button>
                    </div>
            ))}
            
        </div>
    );
}

export default ApplicationsList;
