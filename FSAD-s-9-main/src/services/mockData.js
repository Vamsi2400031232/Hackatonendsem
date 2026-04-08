export const assignments = [
    {
        id: 'a1',
        title: 'Advanced Mathematics Quiz',
        course: 'Mathematics 101',
        dueDate: '2026-02-25T10:00:00',
        status: 'pending',
        description: 'A comprehensive quiz covering calculus and linear algebra concepts.',
        points: 100
    },
    {
        id: 'a2',
        title: 'Physics Laboratory Report',
        course: 'Applied Physics',
        dueDate: '2026-02-28T23:59:59',
        status: 'pending',
        description: 'Submit your findings from the electromagnetism experiment.',
        points: 50
    },
    {
        id: 'a3',
        title: 'World War II Analysis',
        course: 'Global History',
        dueDate: '2026-02-20T17:00:00',
        status: 'graded',
        description: 'Write a 1500-word analysis on the causes of WWII.',
        points: 100,
        grade: 92,
        feedback: 'Excellent work! Your analysis on the economic factors was very insightfull. Keep it up.'
    },
    {
        id: 'a4',
        title: 'Introduction to React',
        course: 'Fullstack Development',
        dueDate: '2026-03-05T09:00:00',
        status: 'pending',
        description: 'Build a simple counter application using React hooks.',
        points: 80
    }
];

export const submissions = [
    {
        id: 'sub1',
        assignmentId: 'a3',
        studentId: 's1',
        studentName: 'John Doe',
        submittedAt: '2026-02-19T14:30:00',
        file: 'history_essay.pdf',
        grade: 92,
        feedback: 'Excellent work!'
    }
];
