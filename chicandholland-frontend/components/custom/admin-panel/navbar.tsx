import ThemeToggle from "@/components/theme-toggle";
import { UserNav } from "@/components/custom/admin-panel/userNav";
import { SheetMenu } from "@/components/custom/admin-panel/sheetMenu";
// import { getDecodedUser } from "@/lib/data";

interface NavbarProps {
  title: string;
  userDetails: any;
}

export async function Navbar({ title, userDetails }: NavbarProps) {
  //   const user = await getDecodedUser();

  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 flex h-14 items-center sm:mx-8">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu userDetails={userDetails} />
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
          <UserNav
            user={{
              name: "Rehan Shaik",
              username: "rehanshaik",
            }}
          />
        </div>
      </div>
    </header>
  );
}
