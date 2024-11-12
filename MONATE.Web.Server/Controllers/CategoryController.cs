namespace MONATE.Web.Server.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using MONATE.Web.Server.Logics;

    [ApiController]
    [Route("[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly MonateDbContext _context;

        public CategoryController(MonateDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var _categories = _context.Categories.ToList();
            return Ok(new { categories = _categories });
        }
    }
}
