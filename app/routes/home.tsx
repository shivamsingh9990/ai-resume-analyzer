import type {Route} from "./+types/home";
import Navbar from "~/components/Navbar";

import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import React, {useEffect, useState} from "react";


export function meta({}: Route.MetaArgs) {
    return [
        {title: "New React Router App"},
        {name: "description", content: "Welcome to React Router!"},
    ];
}

export default function Home() {
    const {auth, kv} = usePuterStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(false);

    useEffect(() => {
        if (!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated])
    useEffect(() => {
        const loadResumes = async () => {
            setLoadingResumes(true);
            const resumes = (await kv.list('resume:*', true)) as KVItem[];
            const parsedResumes = resumes?.map((resume) => (
                JSON.parse(resume.value) as Resume
            ))
            console.log("parsedResumes", parsedResumes);
            setResumes(parsedResumes || []);
            setLoadingResumes(false);
        }
        loadResumes();
    }, []);

    return <main className="bg-[url('/public/images/bg-main.svg')] bg-cover">
        <div className="flex "> <Navbar/>
            <Link to="/wipe" className="primary-button w-fit mr-5 h-fit mt-3 flex items-center justify-center">
                Wipe Data
            </Link>


        </div>

        <section className="main-section">
            <div className="page-heading py-16">
                <h1>Track your Application and resume ratings </h1>
                {!loadingResumes && resumes?.length===0?(
                    <h2>No resume found. Upload your first resume to get feedback.</h2>

                ):(
                    <h2>review your submissions and check AI-powered feedback</h2>
                )}



            </div>
            {loadingResumes && (
                <div className="flex flex-col items-center justify-center">
                    <img src="/public/images/resume-scan-2.gif" className="w-[200px]"/>
                </div>
            )}

            {!loadingResumes && resumes.length > 0 && (
                <div className="resumes-section">
                    {resumes.map((resume) => (
                        <ResumeCard key={resume.id} resume={resume}/>
                    ))}


                </div>
            )}
            {!loadingResumes && resumes.length===0 &&(
                <div className="flex flex-col items-center justify-center mt-10 gap-4">
                    <Link to="/upload" className="primary-button w-fit text-xl font-seimibold">upload Resume</Link>

                </div>
            )}

        </section>



    </main>
}
