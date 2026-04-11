import { useQuery } from '@tanstack/react-query'
import { getSettings } from '../services/public'
import Seo from '../seo/Seo.jsx'

export default function About() {
  const { data } = useQuery({ queryKey: ['settings'], queryFn: getSettings })

  const title = data?.site_name || 'Idea Foundation'
  const aboutText = String(data?.raw?.about || '').trim()

  return (

    <div>
        <div  aria-hidden
          className="h-52 bg-[#fcfcfa] flex justify-center items-center"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23EAEAE8' stroke-width='1'%3E%3Cpath d='M0 0l40 20L0 40zM40 20L80 0v40L40 60zM0 40l40 20L0 80zM40 60l40-20V80L40 100z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '120px'
          }} >
  {/* Header */}
        <div 
        className="text-center ">
          <h1 className="text-4xl  text-stone-800 ">
            دەربارەی ئێمە
          </h1>
          
        </div>
            </div>


    <div className=" min-h-screen " dir="rtl">
      <div  className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content - وەک Hindawi */}
          <div className="lg:col-span-10">
            <div className="prose prose-lg prose-stone max-w-none leading-tight  text-[17.5px]">
              {aboutText ? (
                <div className=' text-xl leading-10 tracking-wide ' dangerouslySetInnerHTML={{ __html: aboutText }} />
                
              ) : (
                <p className="text-stone-600">
                  {title} پلاتفۆڕمێکی گشتییە بۆ ئارشیف و بڵاوکردنەوەی بیرۆکەکان.
                </p>
              )}
            </div>

            {/* ئەگەر دەتەوێت بەشەکانی Vision, Mission, Values جیا بکەیتەوە */}
            <div className="mt-16 space-y-14">
              <div>
                <h2 className="text-2xl  text-orange-400 mb-4">بینینی ئێمە</h2>
                <p className="text-stone-700 leading-relaxed text-[17px]">
                  بەرزکردنەوەی ئاستی زانست و کەلتووری کوردی لە ڕێگەی تەکنەلۆژیا و دەستپێگەیشتنی ئازاد.
                </p>
              </div>

              <div>
                <h2 className="text-2xl  text-orange-400 mb-4">ئامانجمان</h2>
                <p className="text-stone-700 leading-relaxed text-[17px]">
                  دروستکردنی ئارشیفێکی گەورەی بیرۆکە کوردییەکان و بەردەستکردنیان بۆ هەموو کەسێک.
                </p>
              </div>

              <div>
                <h2 className="text-2xl  text-orange-400 mb-6">بەها سەرەکییەکانمان</h2>
                <div className="  ">
                  {['داهێنان', 'دەستپێگەیشتنی ئازاد', 'کوالیتی بەرز', 'شەفافیەت', 'نیشتمانپەروەری'].map((value) => (
                    <div key={value} className="flex gap-x-2  hover:border-orange-200 transition-colors">
                      {/* <span className="text-2xl mb-3 block">→</span> */}
                       <span className="text-2xl mb-3 rotate-180 text-slate-400 ">→</span>
                      <p className=" text-stone-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        
        </div>

        {/* Footer Contact */}
        <div className="mt-20 pt-10 border-t border-stone-200 text-center text-sm text-stone-500">
          بۆ پەیوەندی: <span className="text-orange-600 font-medium">info@ideafoundation.com</span>
        </div>
      </div>
    </div>
    </div>
  )
}