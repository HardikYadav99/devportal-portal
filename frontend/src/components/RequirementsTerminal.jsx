function RequirementsTerminal(){

    return (
        <div className="requirements-terminal">

            <h3> Deployment Requirements </h3>

            <ul> 
                <li> Repository should be Public </li>
                <li> Docker File should exist in the Root Folder of Repository</li>
                <li> Application must expose to PORT 3000</li>
                <li> Node.js applications currently supported</li>
            </ul>
        </div>

    );
}

export default RequirementsTerminal;