export const buildSegmentQuery = (conditions) => {
    return conditions.map(condition => {
        switch (condition.operator) {
            case '>':
                return { [condition.field]: { $gt: condition.value } };
            case '<=':
                return { [condition.field]: { $lte: condition.value } };
            case 'NOT_VISITED_IN':
                const monthsAgo = new Date();
                monthsAgo.setMonth(monthsAgo.getMonth() - condition.value);
                return { lastVisit: { $lt: monthsAgo } };
            default:
                return {};
        }
    });
};