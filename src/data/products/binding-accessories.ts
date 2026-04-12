import type { Product } from '../categories';

export const bindingAccessories: Product[] = [
  {
    id: 'ba-01',
    slug: 'binding-service',
    name: 'Binding Service',
    category: 'binding-accessories',
    images: [],
    description: 'General binding services.',
    shortDescription:
      'Complete document binding services with same day options for business reports, manuals, proposals, and academic work.',
    longDescription:
      'Prime Print provides full-service document binding across the UK with multiple finishing options tailored to business, education, legal, and publishing requirements. Choose from wire, comb, saddle stitch, perfect, glue, tape, screw post, book, and thesis binding with fast turnaround and reliable nationwide delivery.',
    specs: { type: 'Multi-option' },
    status: 'latest',
  },
  { id: 'ba-02', slug: 'spiral-binding', name: 'Spiral Binding', category: 'binding-accessories', images: [], description: 'Plastic coil binding.', specs: { rotation: '360 degrees' }, status: 'Popular' },
  {
    id: 'ba-03',
    slug: 'wire-binding',
    name: 'Wire Binding',
    category: 'binding-accessories',
    images: [],
    description: 'Professional wire-o binding.',
    shortDescription:
      'Professional wire binding with same day options for reports, manuals, and presentations that need a clean lay-flat finish.',
    longDescription:
      'Prime Print offers wire binding services across the UK using durable twin-loop wire for a polished, professional look. Ideal for corporate reports, training packs, proposals, and presentation documents, wire binding provides easy page turning and reliable durability with fast turnaround and nationwide delivery.',
    specs: { material: 'Metal Wire' },
    status: 'Corporate',
  },
  {
    id: 'ba-04',
    slug: 'plastic-comb-binding',
    name: 'Plastic Comb Binding',
    category: 'binding-accessories',
    images: [],
    description: 'Classic comb binding.',
    shortDescription:
      'Affordable plastic comb binding with same day turnaround for manuals, internal documents, and training packs.',
    longDescription:
      'Prime Print provides plastic comb binding across the UK for practical document sets that need flexibility and easy page updates. Popular for reports, educational materials, handbooks, and office manuals, comb binding delivers a cost-effective finish with fast production and dependable nationwide delivery.',
    specs: { reusable: 'Yes' },
    status: 'Standard',
  },
  {
    id: 'ba-05',
    slug: 'saddle-stitch-binding',
    name: 'Saddle Stitch Binding',
    category: 'binding-accessories',
    images: [],
    description: 'Stapled spine binding.',
    shortDescription:
      'Same day saddle stitch binding for booklets, brochures, catalogues, and event programmes with a neat, cost-effective finish.',
    longDescription:
      'Prime Print offers saddle stitch binding services for multi-page documents that need a clean folded-and-stapled spine. Ideal for brochures, catalogues, programmes, and promotional booklets, this binding style is quick to produce, economical for short and medium runs, and available with fast UK-wide delivery.',
    specs: { usage: 'Booklets' },
    status: 'Standard',
  },
  {
    id: 'ba-06',
    slug: 'perfect-binding',
    name: 'Perfect Binding',
    category: 'binding-accessories',
    images: [],
    description: 'Softcover book finish.',
    shortDescription:
      'Premium perfect binding for books, reports, and catalogues with same day options and a professional square-spine finish.',
    longDescription:
      'Prime Print provides perfect binding across the UK for publications that require a polished book-style appearance. Suitable for catalogues, annual reports, magazines, and manuals, perfect binding gives a clean square spine and premium feel while maintaining quick turnaround and reliable nationwide delivery.',
    specs: { spine: 'Glued' },
    status: 'Premium',
  },
  {
    id: 'ba-07',
    slug: 'glue-binding',
    name: 'Glue Binding',
    category: 'binding-accessories',
    images: [],
    description: 'Padding and glue binding.',
    shortDescription:
      'Fast glue binding service for reports, booklets, and internal packs where a neat spine and quick turnaround are essential.',
    longDescription:
      'Prime Print offers professional glue binding for business and academic documents that need a tidy, durable bound edge. This option is suitable for manuals, proposals, reports, and short publications, delivering a practical finish with same day options and dependable delivery across the UK.',
    specs: { type: 'Fan-apart' },
    status: 'Standard',
  },
  {
    id: 'ba-08',
    slug: 'tape-binding',
    name: 'Tape Binding',
    category: 'binding-accessories',
    images: [],
    description: 'Wrapped spine tape binding.',
    shortDescription:
      'Professional tape binding with same day options for legal, corporate, and formal submission documents.',
    longDescription:
      'Prime Print provides tape binding across the UK for reports, legal documents, and tender submissions that require a clean, formal spine finish. Tape binding creates a smart and presentable document style while maintaining fast production schedules and reliable nationwide delivery.',
    specs: { look: 'Clean/Flat' },
    status: 'Standard',
  },
  {
    id: 'ba-09',
    slug: 'screw-binding',
    name: 'Screw Binding',
    category: 'binding-accessories',
    images: [],
    description: 'Chicago screw binding.',
    shortDescription:
      'Premium screw binding for portfolios, menus, swatchbooks, and presentation documents that need durable, replaceable pages.',
    longDescription:
      'Prime Print offers screw post binding across the UK for high-end presentation pieces where durability and flexibility matter. Ideal for menus, sample books, portfolios, and branded document sets, screw binding delivers a robust professional finish with quick turnaround and nationwide delivery.',
    specs: { material: 'Brass/Steel' },
    status: 'Premium',
  },
  {
    id: 'ba-10',
    slug: 'book-binding',
    name: 'Book Binding',
    category: 'binding-accessories',
    images: [],
    description: 'Hardback and bespoke binding.',
    shortDescription:
      'Professional book binding for hardcover and softcover projects with same day options on selected formats.',
    longDescription:
      'Prime Print provides book binding services for short-run publications, corporate books, manuals, and custom print projects. Choose from hardback and softcover styles with quality finishing tailored to your use case, backed by fast turnaround and reliable UK-wide delivery.',
    specs: { type: 'Hard/Soft Cover' },
    status: 'HighEnd',
  },
  {
    id: 'ba-11',
    slug: 'thesis-binding',
    name: 'Thesis Binding',
    category: 'binding-accessories',
    images: [],
    description: 'University standard binding.',
    shortDescription:
      'University-standard thesis binding with same day options for dissertations, research submissions, and academic projects.',
    longDescription:
      'Prime Print offers thesis binding across the UK in hardcover, softcover, perfect bound, and wire formats based on university requirements. Designed for students and researchers with strict deadlines, our thesis service combines quality finishing, fast turnaround, and dependable nationwide delivery.',
    specs: { standard: 'Academic' },
    status: 'StudentDeal',
  },
  { id: 'ba-12', slug: 'dissertation-binding', name: 'Dissertation Binding', category: 'binding-accessories', images: [], description: 'Fast dissertation binding.', specs: { turnaround: 'Same Day' }, status: 'samedayprinting' },
  { id: 'ba-13', slug: 'business-presentation-binding', name: 'Business Presentation Binding', category: 'binding-accessories', images: [], description: 'Elegant presentation sets.', specs: { cover: 'Acetate/Leatherette' }, status: 'Corporate' },
];
