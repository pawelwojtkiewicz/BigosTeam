import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import {
  UserGroupIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
const links = [
  { name: 'Home', href: '/home', icon: HomeIcon },
  { name: 'Main', href: '/', icon: UserGroupIcon },
];

export default function Home() {
  const link = links[1]
  const LinkIcon = link.icon;
  return (
    <div id="home-page">
      Witaj w domu

      <Badge badgeContent={4} color="primary">
        <MailIcon color="primary" />
        <Link
            key={link.name}
            href={link.href}
            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <LinkIcon className="w-6" />
          <p className="hidden md:block">{link.name}</p>
      </Link>
      </Badge>
      <Button variant="text">Text</Button>
      
    </div>
  );
}
