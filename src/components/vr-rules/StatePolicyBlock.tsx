type StatePolocyBlockProps = {
  title: string;
};

export function StatePolicyBlock({ title }: StatePolocyBlockProps) {
  return (
    <div>
      <details className="group">
        <summary className="header-4 mb-2 flex cursor-pointer list-none items-center gap-2 font-extrabold [&::-webkit-details-marker]:hidden">
          <span
            className="transition-transform select-none group-open:rotate-90"
            aria-hidden
          >
            ▸
          </span>
          {title}
        </summary>
        <div className="font-lora space-y-4 border-t border-gray-300 pt-2">
          <p>
            <strong>Cal Elec Code 2146 (a)</strong> The Secretary of State shall
            annually provide every high school, community college, and
            California State University and University of California campus with
            voter registration forms. The Secretary of State shall provide
            additional forms to a school, free of charge, if so requested by a
            school.
          </p>
          <p>
            <strong>Cal Elec Code 2146 (b)</strong> The Secretary of State shall
            provide a written notice with each registration form describing
            eligibility requirements and informing each student that he or she
            may return the completed form in person or by mail to the elections
            official of the county in which the student resides or to the
            Secretary of State.
          </p>

          <p>
            <strong>Cal Elec Code 2146 (e)</strong> It is the intent of the
            Legislature that every eligible high school and college student
            receive a meaningful opportunity to apply to register to vote. It is
            also the intent of the Legislature that every school do all in its
            power to ensure that students are provided the opportunity and means
            to apply to register to vote. This may include providing voter
            registration forms at the start of the school year, including voter
            registration forms with orientation materials; placing voter
            registration forms at central locations, including voter
            registration forms with graduation materials; or providing
            hyperlinks to, and the Internet Web site address of, the Secretary
            of State&apos;s electronic voter registration system in notices sent
            by electronic mail to students and placed on the Internet Web site
            of the high school, college, or university.
          </p>
          <p>
            <strong>Cal. Elec. Code §2148 (a)</strong> Every high school,
            community college, and California State University campus shall
            designate a contact person and provide his or her address, telephone
            number, and e-mail address, when possible, to the Secretary of State
            for the Secretary of State to contact in order to facilitate the
            distribution of voter registration cards, as provided under this
            article.
          </p>
          <p>
            <strong>Cal. Educ. Code § 49040</strong> The last two full weeks in
            April and the last two full weeks in September shall be known as
            &apos;high school voter education weeks,&apos; during which time
            persons authorized by the county elections official shall be allowed
            to register students and school personnel on any high school campus
            ….
          </p>
          <p>
            <strong>Cal. Educ. Code § 49041</strong> The administrator of a high
            school, or his or her designee, may appoint one or more pupils … to
            be voter outreach coordinators,&apos; and those coordinators may
            coordinate voter-registration activities and other election-related
            outreach on campus.
          </p>
        </div>
      </details>
    </div>
  );
}
