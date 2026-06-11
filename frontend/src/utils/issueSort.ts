import dayjs from "dayjs";

type IssueWithPublishDate = {
  PublishDate?: string | Date | null;
};

export function sortIssuesByPublishProximity<T extends IssueWithPublishDate>(
  issues: T[],
): T[] {
  const today = dayjs().startOf("day");

  const getDate = (issue: T) => {
    if (!issue.PublishDate) return null;
    return dayjs(issue.PublishDate).startOf("day");
  };

  return [...issues].sort((a, b) => {
    const dateA = getDate(a);
    const dateB = getDate(b);

    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    const isPastA = dateA.isBefore(today);
    const isPastB = dateB.isBefore(today);

    if (!isPastA && isPastB) return -1;
    if (isPastA && !isPastB) return 1;

    if (!isPastA && !isPastB) {
      return dateA.valueOf() - dateB.valueOf();
    }

    return dateB.valueOf() - dateA.valueOf();
  });
}
