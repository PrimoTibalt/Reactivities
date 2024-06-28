using Application.Core;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class ListByUser
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Predicate { get; set; }
            public string Username { get; set; }
        }

        public class RequestHandler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly IMapper _mapper;
            private readonly DataContext _context;

            public RequestHandler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Activities
                    .Where(a => a.Attendees.Any(at => at.AppUser.UserName == request.Username))
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider,
                        new { currentUsername = request.Username});
                    
                switch (request.Predicate.ToUpperInvariant())
                {
                    case "HOST" or "HOSTING":
                        query = query.Where(a => a.HostUsername == request.Username);
                        break;
                    case "PAST":
                        query = query.Where(a => a.Date <= DateTime.UtcNow);
                        break;
                    case "FUTURE":
                        query = query.Where(a => a.Date >= DateTime.UtcNow);
                        break;
                    default:
                        throw new NotImplementedException($"Unknown request predicate '{request.Predicate}'");
                }

                return Result<List<UserActivityDto>>.Success(await query.OrderBy(d => d.Date).ToListAsync());
            }
        }
    }
}