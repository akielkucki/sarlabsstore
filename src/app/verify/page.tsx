import Link from "next/link";

export default function VerifyPage() {
	return (
		<div className="flex min-h-[85vh] items-center justify-center px-4">
			<div className="text-center max-w-md">
				<div className="mx-auto h-20 w-20 rounded-2xl bg-rose-500/10 border border-rose-500/15 flex items-center justify-center mb-6">
					<svg
						className="w-10 h-10 text-rose-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1.5}
							d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
						/>
					</svg>
				</div>
				<h1 className="text-3xl font-black text-foreground mb-3">
					Check Your Email
				</h1>
				<p className="text-muted-foreground mb-6">
					A sign-in link has been sent to your email address. Click the link to
					sign in.
				</p>
				<Link
					href="/signin"
					className="text-sm text-rose-400 hover:text-rose-300 transition-colors"
				>
					Didn&apos;t receive it? Try again
				</Link>
			</div>
		</div>
	);
}
