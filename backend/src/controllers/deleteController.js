const {
    triggerDeleteWorkflow,
} = require ("../services/triggerDeleteWorkflow");

const deleteApplication = async (
    req,
    res
) => {
    try {
        const { appName } = req.params;

        await triggerDeleteWorkflow(
            appName
        );

        res.json({
            success: true,
            message:
                "Deletion Pipeline Succesfully Triggered"
        }); 
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to trigger deletion pipeline "
        });
    }
};

module.exports = {
    deleteApplication,
};