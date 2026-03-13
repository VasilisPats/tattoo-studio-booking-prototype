import * as Sentry from "@sentry/react";

/**
 * A floating debug button that triggers a test Sentry error.
 * Only visible in development mode (import.meta.env.DEV).
 */
const SentryDebugButton = () => {
    if (!import.meta.env.DEV) return null;

    const handleTestError = () => {
        try {
            throw new Error("🧪 Sentry test error — if you see this in your Sentry dashboard, it works!");
        } catch (error) {
            Sentry.captureException(error);
            alert("✅ Test error sent to Sentry! Check your Sentry dashboard.");
        }
    };

    return (
        <button
            onClick={handleTestError}
            style={{
                position: "fixed",
                bottom: "1rem",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 9999,
                padding: "0.6rem 1.2rem",
                backgroundColor: "#362D59",
                color: "#fff",
                border: "2px solid #8B5CF6",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(139, 92, 246, 0.3)",
                transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#8B5CF6";
                e.currentTarget.style.transform = "translateX(-50%) scale(1.05)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#362D59";
                e.currentTarget.style.transform = "translateX(-50%) scale(1)";
            }}
        >
            🐛 Test Sentry Error
        </button>
    );
};

export default SentryDebugButton;
