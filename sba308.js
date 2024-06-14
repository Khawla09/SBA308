function getLearnerData(course, ag, submissions) {
  const assignmentIds = ag.assignments.map((a) => a.id);
  const assignmentsMap = ag.assignments.reduce((map, assignment) => {
    map[assignment.id] = assignment;

    return map;
  }, {});

  const learnersMap = {};

  submissions.forEach(({ learner_id, assignment_id, submission }) => {
    if (!assignmentIds.includes(assignment_id)) {
      return;
    }

    //init learner data if nor alredy present
    const assignment = assignmentsMap[assignment_id];
    // console.log(assignment);
    const pointsPossible = assignment.points_possible;
    const dueData = new Date(assignment.due_at);
    const submissionDate = new Date(submission.submitted_at);
    let score = submission.score;
    if (submissionDate > dueData) {
      score = Math.max(score - 15, 0);
    }
    const scoreRatio = score / pointsPossible;
    // console.log(scoreRatio);
    if (!learnersMap[learner_id]) {
      learnersMap[learner_id] = {
        id: learner_id,
        totalScore: 0,
        totalPossible: 0,
        assignments: {},
      };
    }
    learnersMap[learner_id].totalPossible += pointsPossible;
    learnersMap[learner_id].assignments[assignment_id] = scoreRatio.toFixed(3);
  });
  const result = Object.values(learnersMap).map((learner) => {
    const avr = (learner.totalScore / learner.totalPossible).toFixed(3);
    return {
      ...learner.assignments,
      id: learner.id,
      avr,
    };
  });
  return result;
}

///////////////////
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};

const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];
console.log(getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions));
