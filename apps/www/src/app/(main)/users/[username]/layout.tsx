export default function UserLayout({
	children,
}: LayoutProps<"/users/[username]">) {
	return <div>{children}</div>;
}
