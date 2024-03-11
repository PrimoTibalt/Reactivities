using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Activity>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Activity>
        {
            public DataContext DataContext { get; }

            public Handler(DataContext dataContext)
            {
                DataContext = dataContext;
            }

            public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
            {
                return await DataContext.Activities.FindAsync(request.Id);
            }
        }
    }
}