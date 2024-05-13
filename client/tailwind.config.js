/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: "#3A5743",
                    dark: "#314939",
                },
                gray: {
                    lighter: "#f7f7f7",
                    semilight: "#e5e5e5",
                    light: "#9194a1",
                    dark: "#222222",
                },
                background: "#fcfcfc",
            },
            height: {
                header: "76px",
                content: "calc(100dvh - 76px)",
                "banner-image": "calc(100dvh - 124px)", // 76px + 48px (48px from the section padding)
            },
            backgroundImage: {
                "gradient-radial":
                    "linear-gradient(to right, #ffebff 0%, #fff2c4 100%)",
                "gradient-radial2":
                    "linear-gradient(to right, #ffedfd 0%, #e8fbdc 100%)",
                "text-gradient":
                    "linear-gradient(to right, #f2a7f2 0%, #ffdd66 80%)",
            },
            spacing: {
                header: "76px",
                18: "4.5rem",
            },
        },
    },
    plugins: [],
};
