def calculate_match_score(job, user_skills):
    job_text = (job.get("title", "") + " " + job.get("company", "")).lower()

    matched = []
    missing = []

    for skill in user_skills:
        if skill.lower() in job_text:
            matched.append(skill)
        else:
            missing.append(skill)

    score = (len(matched) / len(user_skills)) * 100 if user_skills else 0

    return {
        "score": round(score, 2),
        "matched_skills": matched,
        "missing_skills": missing
    }


def rank_jobs(jobs, user_skills):
    ranked = []

    for job in jobs:
        result = calculate_match_score(job, user_skills)

        job_data = {
            **job,
            **result
        }

        ranked.append(job_data)

    ranked.sort(key=lambda x: x["score"], reverse=True)

    return ranked