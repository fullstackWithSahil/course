import Image from 'next/image';
import React from 'react';
import { buttonVariants } from '../ui/button';
import Link from 'next/link';

export default function CourseCard({
    thumbnail,
    created_at,
    students,
    description,
    name,
    id,
}: {
    created_at: string;
    name: string;
    description: string;
    thumbnail: string;
    id: number;
    students: number;
}) {
    const fmdate = new Date(created_at);
    const date =
        fmdate.getDate().toString() +
        '/' +
        (fmdate.getMonth() + 1).toString() +
        '/' +
        fmdate.getFullYear().toString();

    return (
        <div className="flex flex-col md:flex-row items-center border border-gray-300 rounded-lg shadow-md p-4 gap-4 bg-white mx-3">
            <div className="w-full md:w-1/2 flex justify-center">
                <Image
                    src={thumbnail}
                    alt="thumbnail"
                    className="w-full h-auto max-h-60 object-cover rounded-md"
                />
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-2">
                <h1 className="text-xl md:text-2xl font-semibold text-center md:text-left text-gray-800">
                    {name}
                </h1>
                <p className="text-sm md:text-base text-gray-600">{description}</p>
                <p className="text-sm text-gray-700">Total students: {students}</p>
                <Link href={`/chats/${id}`} className={`${buttonVariants()} w-max`}>
                    See Chats
                </Link>
                <span className="text-xs text-gray-500 mt-2 md:mt-4 text-right">
                    {date}
                </span>
            </div>
        </div>
    );
}
