"use client";

type Props = {
  name: string;
  onClick?: () => void;
};

function getInitials(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts[1]?.[0] ?? "";
  return (first + last).toUpperCase();
}

export default function UserAvatar({ name, onClick }: Props) {
  const initials = getInitials(name);

  return (
    <div
      title={name}
      onClick={onClick}
      className="
        cursor-pointer 
        w-10 
        h-10 
        rounded-full 
        bg-gray-300 
        text-gray-700
        dark:bg-tnStormAccent3 
        dark:text-tnStormBg
        flex 
        items-center 
        justify-center 
        font-bold
      "
    >
      {initials}
    </div>
  );
}
