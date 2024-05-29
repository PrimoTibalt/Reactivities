using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Profile Profile { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == request.Profile.Username);
                if (user == null) return null;
                user.DisplayName = request.Profile.DisplayName;
                user.Bio = request.Profile.Bio;
                if (await _context.SaveChangesAsync() < 1)
                    return Result<Unit>.Failure("Values are identical to previous");
                    
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}