export const SignupOptions = () => ({
  mutationFn: async (values: any) => {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || "errors.serverError");
    }

    return data;
  },
  staleTime: 1000 * 60 * 15,
});
